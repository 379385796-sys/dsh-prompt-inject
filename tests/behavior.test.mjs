import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import { resolveSelection, normalizeWorkspacePath, effectivePresetSelections } from '../lib/selection.js';
function host(){const fluent=new Proxy(()=>fluent,{get:()=>fluent});const c={z:fluent,resolveSelection,normalizeWorkspacePath,effectivePresetSelections};let text=fs.readFileSync(new URL('../lib/index.js',import.meta.url),'utf8');text=text.replace(/^import .*$/mg,'').replace(/^export \{.*$/mg,'').replace(/^export /mg,'');vm.runInNewContext(text+'\nglobalThis.plugin={apply,normalizeWorkspacePath};',c);return c.plugin;}
function fixture(){let templates=[{name:'global',text:'SYNTHETIC_GLOBAL'},{name:'work',text:'SYNTHETIC_WORKSPACE'}],active='global',overrides={'D:\\SyntheticProject':'work','D:\\Disabled':''};let variable,section;const ctx={effect:fn=>fn(),fiber:{},settings:{configure:()=>()=>{}},systemPrompt:{variable:(_name,fn)=>{variable=fn;},section:s=>{section=s;}}};host().apply(ctx,{templates:{get:()=>templates},activeTemplate:{get:()=>active},workspaceOverrides:{get:()=>overrides}});return {read:cwd=>variable({agent:{session:{header:{cwd}}}}),setActive:a=>{active=a;},setTemplates:a=>{templates=a;},section:()=>section};}
test('live global selection and exact workspace override remain distinct',()=>{const f=fixture();assert.equal(f.read('D:\\Other'),'SYNTHETIC_GLOBAL');assert.equal(f.read('D:\\SyntheticProject'),'SYNTHETIC_WORKSPACE');assert.equal(f.read('D:\\Disabled'),'');assert.equal(f.read('d:\\SyntheticProject'),'SYNTHETIC_GLOBAL');assert.equal(f.read('D:/SyntheticProject'),'SYNTHETIC_GLOBAL');f.setActive('work');assert.equal(f.read(''),'SYNTHETIC_WORKSPACE');});
test('ambiguous or removed template names do not inject arbitrary content',()=>{const f=fixture();f.setTemplates([{name:'global',text:'A'},{name:'global',text:'B'}]);assert.equal(f.read(''),'');f.setTemplates([]);assert.equal(f.read(''),'');});
test('section uses the host assembly variable and retains order and root semantics',()=>{const f=fixture();assert.equal(f.section().text,'{{dsh_prompt_inject_text}}');assert.equal(f.section().order,50);const p=host();assert.equal(p.normalizeWorkspacePath('D:\\'),'D:\\');assert.equal(p.normalizeWorkspacePath('D:\\SyntheticProject\\'),'D:\\SyntheticProject');assert.equal(p.normalizeWorkspacePath(''),'');});

test('resolver keeps legacy exact path, own-key, and empty selection behavior', () => {
  const cfg = { templates: [{name:'g',text:'SYNTHETIC_G'},{name:'w',text:'\r\n  SYNTHETIC_W\n'}], activeTemplate:'g', workspaceOverrides: {'D:\\Project':'w','D:\\Off':'','D:\\':'w','/':'w','\\\\server\\share':'w'} };
  for (const path of ['D:\\Project', 'D:\\Project\\', 'D:\\Project/','D:\\','D:/','/','\\\\server\\share\\']) assert.equal(resolveSelection(cfg,path).selected,'w');
  for (const path of [undefined,'','d:\\Project','D:/Project','D:\\Project\\Child','toString']) assert.equal(resolveSelection(cfg,path).selected,'g');
  assert.equal(resolveSelection(cfg,'D:\\Off').status,'disabled');
  assert.equal(resolveSelection(cfg,'D:\\Project').text,cfg.templates[1].text);
  assert.equal(resolveSelection({...cfg,activeTemplate:''},'').status,'none');
  assert.equal(resolveSelection({...cfg,activeTemplate:'gone'},'').status,'missing');
  assert.equal(resolveSelection({...cfg,templates:[{name:'g',text:'A'},{name:'g',text:'B'}]},'').status,'ambiguous');
  assert.equal(resolveSelection({...cfg,templates:[{name:'g',text:''}]},'').status,'resolved');
});

test('Host reads live edited text on the next assembly and preserves the single section contract', () => {
  const f=fixture();
  f.setTemplates([{name:'global',text:'\r\n  SYNTHETIC_EDIT\n'}]);
  assert.equal(f.read(''),'\r\n  SYNTHETIC_EDIT\n');
  assert.equal(f.section().name,'user:prompt-inject');
  assert.equal(Object.hasOwn(f.section(),'complete'),false);
});

test('current preset exclusion precedes workspace selection and is local to each assembly',()=>{
  let enabled=true,ids=['roleplay','character-forge'],read
  const current=new Map(),ctx={effect:fn=>fn(),settings:{configure:()=>()=>{}},get:key=>{
    assert.equal(key,'sessionProjections');return {stateOf:(session,key)=>{assert.equal(key,'agentPreset');return current.get(session)}}
  },systemPrompt:{variable:(_,fn)=>{read=fn},section:()=>{}}}
  host().apply(ctx,{templates:{get:()=>[{name:'g',text:'SYNTHETIC_GLOBAL'},{name:'w',text:'SYNTHETIC_WORK'}]},activeTemplate:{get:()=> 'g'},workspaceOverrides:{get:()=>({'D:/Synthetic':'w'})},excludeByPreset:{get:()=>enabled},excludedPresetIds:{get:()=>ids}})
  const a={header:{cwd:'D:/Synthetic',agentPreset:'standard'}},b={header:{}}
  current.set(a,'roleplay');current.set(b,'standard')
  assert.equal(read({agent:{session:a}}),'');assert.equal(read({agent:{session:b}}),'SYNTHETIC_GLOBAL')
  current.set(a,'character-forge');assert.equal(read({agent:{session:a}}),'')
  current.set(a,'ptc');assert.equal(read({agent:{session:a}}),'SYNTHETIC_WORK')
  enabled=false;current.set(a,'roleplay');assert.equal(read({agent:{session:a}}),'SYNTHETIC_WORK')
  enabled=true;ids=['private-synthetic'];current.set(a,'private-synthetic');assert.equal(read({agent:{session:a}}),'')
  current.delete(a);assert.throws(()=>read({agent:{session:a}}),/current Agent Preset unavailable/)
  assert.throws(()=>read({}),/current Agent Preset unavailable/)
  enabled=false;assert.equal(read({}),'SYNTHETIC_GLOBAL')
})

test('three-state mapping resolves preset before workspace and global; missing references never fall back',()=>{
 const cfg={templates:[{name:'g',text:'GLOBAL'},{name:'w',text:'WORK'},{name:'p',text:'PRESET'}],activeTemplate:'g',workspaceOverrides:{'/work':'w','/off':''},presetSelectionVersion:1,presetSelections:{rp:{mode:'none'},specific:{mode:'template',template:'p'},inherit:{mode:'default'},missing:{mode:'template',template:'gone'},bad:{mode:'template'}}}
 assert.equal(resolveSelection(cfg,'/work','inherit').text,'WORK');assert.equal(resolveSelection(cfg,'/other','inherit').text,'GLOBAL')
 assert.equal(resolveSelection(cfg,'/work','new-id').text,'WORK');assert.equal(resolveSelection(cfg,'/work','rp').text,'')
 assert.equal(resolveSelection(cfg,'/off','specific').text,'PRESET');assert.equal(resolveSelection(cfg,'/work','specific').text,'PRESET')
 assert.equal(resolveSelection(cfg,'/work','missing').status,'missing');assert.equal(resolveSelection(cfg,'/work','missing').text,'')
 assert.equal(resolveSelection(cfg,'/work','bad').status,'invalid');assert.equal(resolveSelection(cfg,'/off','inherit').text,'')
 const removed={...cfg,templates:cfg.templates.filter(t=>t.name!=='p')};assert.equal(resolveSelection(removed,'/work','specific').status,'missing');assert.equal(resolveSelection(removed,'/work','specific').text,'')
 const duplicate={...cfg,templates:[...cfg.templates,{name:'p',text:'OTHER'}]};assert.equal(resolveSelection(duplicate,'','specific').status,'ambiguous')
})

test('legacy migration is deterministic, idempotent, honors disabled switch and preserves explicit newer data',()=>{
 const legacy={excludeByPreset:true,excludedPresetIds:['roleplay','roleplay','hidden-id'],presetSelections:{roleplay:{mode:'template',template:'p'}}}
 const before=JSON.stringify(legacy),map=effectivePresetSelections(legacy)
 assert.deepEqual(map,{roleplay:{mode:'template',template:'p'},'hidden-id':{mode:'none'}});assert.equal(JSON.stringify(legacy),before)
 assert.deepEqual(effectivePresetSelections({...legacy,presetSelectionVersion:1,presetSelections:map}),map)
 assert.deepEqual(effectivePresetSelections({...legacy,excludeByPreset:false,presetSelections:{}}),{})
 assert.deepEqual(effectivePresetSelections({...legacy,presetSelectionVersion:1,presetSelections:{}}),{})
 assert.throws(()=>effectivePresetSelections({presetSelectionVersion:2}),/Unsupported/)
})
