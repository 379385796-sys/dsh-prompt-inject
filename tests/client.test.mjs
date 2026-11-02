import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { resolveSelection } from '../lib/selection.js'

// Dependency-free component model: exercises the registered page's handlers,
// held hook state and synthetic ConfigForms snapshots; not a Desktop GUI test.
function client() {
  let plugin, cursor=0
  const held=[]
  const React={
    Fragment: 'fragment',
    createElement: (type, props, ...children) => ({type,props:props||{},children:children.flat(Infinity).filter(v=>v!==null&&v!==undefined&&v!==false)}),
    useState(initial) { const i=cursor++; if (!(i in held)) held[i]=initial; return [held[i],v=>{held[i]=typeof v==='function'?v(held[i]):v}] },
    useRef(initial) { const i=cursor++; if (!(i in held)) held[i]={current:initial}; return held[i] },
    useEffect(fn) { const i=cursor++; if (!(i in held)) { held[i]=true; fn() } },
    useCallback: fn=>fn, useMemo: fn=>fn(), useSyncExternalStore: (_subscribe,read)=>read(),
  }
  vm.runInNewContext(fs.readFileSync(new URL('../lib/client.js',import.meta.url),'utf8'),{
    window:{__ModuleLoader__:{load:entry=>{plugin=entry.factory(name=>{assert.equal(name,'react');return React})}}},
  })
  return {plugin, render(node) {cursor=0; while(typeof node.type==='function') node=node.type(node.props); return node}}
}

function config() {
  return {templates:[{name:'global',text:'SYNTHETIC_GLOBAL'},{name:'work',text:'\r\n  SYNTHETIC_WORK\n'}],activeTemplate:'global',workspaceOverrides:{'D:\\Project':'work','D:\\Off':''}}
}
function controller(value=config()) {
  let snapshot={status:'ready',writable:true,revision:7,value:structuredClone(value)}
  const calls=[]
  const ctl={
    getSnapshot:()=>snapshot,subscribe:()=>()=>{},calls,reject:false,gate:null,
    replace(patch) {snapshot={...snapshot,...patch}},
    async mutate(ops, revision) {
      calls.push({ops,revision})
      if(ctl.gate) await ctl.gate
      if(ctl.reject || revision!==snapshot.revision) return false
      const value=structuredClone(snapshot.value)
      for(const op of ops) value[op.path[0]]=structuredClone(op.value)
      snapshot={...snapshot,value,revision:snapshot.revision+1};return true
    },
  }
  return ctl
}
const nodes=(tree,predicate)=>{
  const found=[]
  function walk(node) {if(!node||typeof node!=='object')return;if(predicate(node))found.push(node);for(const c of node.children||[])walk(c)}
  walk(tree);return found
}
const textOf=node=>typeof node==='string'?node:(node?.children||[]).map(textOf).join(' ')

function page(language='zh') {
  const runtime=client(),ctl=controller(),registrations=[],events={},dict={}
  let locale=language, workspaces=[{workspaceId:'project',title:'Synthetic project',path:'D:\\Project'},{workspaceId:'off',path:'D:\\Off'},{workspaceId:'inherit',path:'D:\\Other'}]
  const refresh={error:null,load:async()=>{}}
  const roster={rows:[{id:'roleplay',name:'Roleplay'},{id:'character-forge',name:'Character Forge'},{id:'ordinary-synthetic',name:'Ordinary'}],fail:false}
  const ctx={
    remote:{agentPresets:{list:async()=>roster.fail?{ok:false,error:{message:'SYNTHETIC_FAILURE'}}:{ok:true,value:{presets:roster.rows}}}},
    effect:fn=>fn(),on:(event,fn)=>{events[event]=fn},
    locale:{register:(_ns,bundles)=>{Object.assign(dict,bundles);return ()=>{}},bind:ns=>key=>ns==='settings.agentPreset'?({zh:{presetStandardName:'标准模式',presetPtcName:'PTC 模式',presetMinimalName:'极简模式',presetCordisName:'创造模式'},en:{presetStandardName:'Standard mode',presetPtcName:'PTC mode',presetMinimalName:'Minimal mode',presetCordisName:'Creator mode'}}[locale][key]||key):dict[locale][key]},
    configForms:{get:entry=>{assert.equal(entry,'prompt-inject');return ctl},describe:()=>({load:()=>refresh.load(),getSnapshot:()=>({status:'ready',error:refresh.error})})},
    slots:{inject:(slot,fn)=>{assert.equal(slot,'settings.section');return fn()},register:(options,component)=>{registrations.push({options,component});return ()=>{}}},
  }
  runtime.plugin.apply(ctx)
  const tree=()=>{
    const entry=registrations[0]
    return runtime.render({type:entry.component,props:{t:key=>dict[locale][key],useWorkspaces:select=>select({items:workspaces})}})
  }
  return {ctl,events,registrations,dict,tree,refresh,roster,locale:l=>{locale=l},workspaces:ws=>{workspaces=ws},
    button:label=>{const node=nodes(tree(),n=>n.type==='button'&&textOf(n)===label)[0];assert.ok(node,`button ${label}`);return node},
    select:label=>{const node=nodes(tree(),n=>n.type==='select'&&n.props['aria-label']===label)[0];assert.ok(node,`select ${label}`);return node},
    target:()=>nodes(tree(),n=>n.type==='select'&&!n.props['aria-label'])[0],
  }
}

test('single direct section, native order, complete page and bilingual copy',()=>{
  const p=page()
  assert.equal(p.registrations.length,1)
  assert.equal(p.registrations[0].options.order,21)
  assert.equal(p.registrations[0].options.label(),'系统提示词注入')
  const tree=p.tree()
  assert.equal(nodes(tree,n=>'aria-expanded' in n.props).length,0)
  assert.deepEqual(nodes(tree,n=>n.type==='h3').map(textOf),['模板管理','默认模板','Agent 模式与提示词'])
  assert.equal(nodes(tree,n=>n.type==='details').length,1)
  assert.ok(!nodes(tree,n=>n.type==='details')[0].props.open)
  assert.ok(textOf(tree).includes('明文'))
  assert.ok(textOf(tree).includes('Complete Persona'))
  assert.ok(textOf(tree).includes('下一'))
  assert.deepEqual(Object.keys(p.dict.zh).sort(),Object.keys(p.dict.en).sort())
  p.locale('en');assert.equal(p.registrations[0].options.label(),'System Prompt Injection')
  assert.ok(textOf(p.tree()).includes('not the current chat'))
  for(const lang of ['zh','en']) assert.equal(JSON.parse(fs.readFileSync(new URL(`../locale/${lang}.json`,import.meta.url))).meta.title,p.dict[lang].title)
})

test('browser and Host resolver agree on legacy, missing, ambiguous and root cases',()=>{
  const {plugin}=client(), cfg=config()
  const before=JSON.stringify(cfg)
  for(const cwd of [undefined,'','D:\\Project','D:\\Project\\','D:\\Off','d:\\Project','D:/Project','D:\\Project\\Child','D:\\','/','\\\\server\\share\\','__proto__']) {
    assert.equal(JSON.stringify(plugin.resolveSelection(cfg,cwd)),JSON.stringify(resolveSelection(cfg,cwd)))
  }
  for(const patch of [{activeTemplate:''},{activeTemplate:'gone'},{templates:[{name:'global',text:'A'},{name:'global',text:'B'}]},{templates:[{name:'global',text:''}]}]) {
    const value={...cfg,...patch}
    assert.equal(JSON.stringify(plugin.resolveSelection(value,'')),JSON.stringify(resolveSelection(value,'')))
  }
  assert.equal(JSON.stringify(cfg),before)
})

test('preview chooses explicit workspace, handles disabled/inherit/missing, never falls back after workspace removal',()=>{
  const p=page()
  assert.equal(p.target().props.value,'')
  p.target().props.onChange({target:{value:'project'}})
  assert.ok(textOf(p.tree()).includes('指定模板（替换全局）'))
  assert.ok(nodes(p.tree(),n=>n.props.className==='pt-previewBody').some(n=>textOf(n)==='\r\n  SYNTHETIC_WORK\n'))
  p.target().props.onChange({target:{value:'off'}})
  assert.ok(textOf(p.tree()).includes('此工作区不注入'))
  assert.equal(nodes(p.tree(),n=>n.props.className==='pt-previewBody').length,0)
  p.target().props.onChange({target:{value:'inherit'}})
  assert.ok(textOf(p.tree()).includes('跟随全局'))
  p.ctl.replace({value:{...config(),activeTemplate:'gone'}})
  assert.ok(textOf(p.tree()).includes('模板不存在'))
  assert.ok(p.select('默认模板').children.some(n=>n.props.value==='gone'&&n.props.disabled))
  p.workspaces([])
  assert.ok(textOf(p.tree()).includes('预览工作区已不在列表中'))
  assert.equal(nodes(p.tree(),n=>n.props.className==='pt-previewBody').length,0)
})

test('editor preserves raw text and old data, scope operations and deletion safety',async()=>{
  const {plugin}=client(),ctl=controller(),edit=plugin.createEditor(ctl)
  const invoke=(action,body)=>edit(action,body,ctl.getSnapshot().revision)
  const raw='\r\n  SYNTHETIC_ADDED\n\t'
  await invoke('add',{name:'new',text:raw})
  assert.equal(ctl.getSnapshot().value.templates.at(-1).text,raw)
  assert.equal(ctl.getSnapshot().value.templates[1].text,config().templates[1].text)
  await invoke('edit',{name:'new',text:raw+'EDIT'})
  await invoke('active',{name:'new'})
  await invoke('workspace',{path:'D:\\Project\\',name:'new'})
  assert.equal(resolveSelection(ctl.getSnapshot().value,'D:\\Project').text,raw+'EDIT')
  await invoke('workspace',{path:'D:\\Project',name:'__inherit__'})
  assert.equal(resolveSelection(ctl.getSnapshot().value,'D:\\Project').mode,'inherit')
  await invoke('workspace',{path:'D:\\Project',name:''})
  assert.equal(resolveSelection(ctl.getSnapshot().value,'D:\\Project').status,'disabled')
  await invoke('workspace',{path:'D:\\Project',name:'new'})
  await invoke('delete',{name:'new'})
  assert.equal(ctl.getSnapshot().value.activeTemplate,'')
  assert.equal(ctl.getSnapshot().value.workspaceOverrides['D:\\Project'],'')
  assert.equal(resolveSelection(ctl.getSnapshot().value,'D:\\Project').status,'disabled')
  await assert.rejects(invoke('add',{name:'__inherit__',text:'x'}))
  await assert.rejects(invoke('add',{name:'global',text:'x'}))
  const before=JSON.stringify(ctl.getSnapshot().value)
  await assert.rejects(edit('delete',{name:'global'},-1))
  assert.equal(JSON.stringify(ctl.getSnapshot().value),before)
  ctl.replace({writable:false});await assert.rejects(invoke('active',{name:''}))
})

test('draft survives revision conflict and reconnect, explicit refresh allows retry',async()=>{
  const p=page()
  p.button('添加模板').props.onClick()
  let tree=p.tree()
  nodes(tree,n=>n.type==='input')[0].props.onChange({target:{value:'draft'}})
  tree=p.tree()
  nodes(tree,n=>n.type==='textarea')[0].props.onChange({target:{value:'SYNTHETIC_DRAFT'}})
  assert.ok(!nodes(p.tree(),n=>n.props.className==='pt-previewBody').some(n=>textOf(n)==='SYNTHETIC_DRAFT'))
  p.ctl.replace({revision:8})
  await p.button('保存').props.onClick()
  assert.equal(p.ctl.calls.at(-1).revision,7)
  assert.equal(nodes(p.tree(),n=>n.type==='textarea')[0].props.value,'SYNTHETIC_DRAFT')
  assert.ok(!p.ctl.getSnapshot().value.templates.some(t=>t.name==='draft'))
  p.events['connection/reset']()
  const calls=p.ctl.calls.length
  await p.button('保存').props.onClick()
  assert.equal(p.ctl.calls.length,calls)
  assert.ok(textOf(p.tree()).includes('Host reconnected'))
  await p.button('刷新').props.onClick()
  await p.button('保存').props.onClick()
  assert.equal(p.ctl.getSnapshot().value.templates.at(-1).text,'SYNTHETIC_DRAFT')
  assert.equal(nodes(p.tree(),n=>n.type==='textarea'&&n.props['aria-label']==='提示词正文').length,0)
})

test('mode rows save three states with visible acknowledgement; conflicts leave saved state intact',async()=>{
  const p=page(), original=structuredClone(p.ctl.getSnapshot().value)
  p.tree();await new Promise(setImmediate)
  assert.equal(p.select('Roleplay · roleplay').props.value,'default')
  assert.ok(textOf(p.select('Roleplay · roleplay')).includes('跟随默认 · global'))
  await p.select('Roleplay · roleplay').props.onChange({target:{value:'none'}})
  assert.deepEqual(p.ctl.getSnapshot().value.presetSelections.roleplay,{mode:'none'})
  assert.equal(p.ctl.getSnapshot().value.presetSelectionVersion,1);assert.ok(textOf(p.tree()).includes('已保存'))
  await p.select('Roleplay · roleplay').props.onChange({target:{value:'template:work'}})
  assert.deepEqual(p.ctl.getSnapshot().value.presetSelections.roleplay,{mode:'template',template:'work'})
  p.ctl.reject=true
  await p.select('Roleplay · roleplay').props.onChange({target:{value:'default'}})
  assert.equal(p.select('Roleplay · roleplay').props.value,'template:work')
  assert.ok(textOf(p.tree()).includes('Save rejected'))
  for(const k of Object.keys(original))assert.deepEqual(p.ctl.getSnapshot().value[k],original[k])
})

test('legacy enabled/disabled migration is atomic and a rejected first save never migrates',async()=>{
  const {plugin}=client();for(const enabled of [true,false]){
    const value={...config(),excludeByPreset:enabled,excludedPresetIds:['roleplay','hidden']},ctl=controller(value),edit=plugin.createEditor(ctl)
    ctl.reject=true;await assert.rejects(edit('preset',{id:'other',mode:'template',template:'work'},7));assert.deepEqual(ctl.getSnapshot().value,value)
    ctl.reject=false;await edit('preset',{id:'other',mode:'template',template:'work'},7)
    const saved=ctl.getSnapshot().value;assert.equal(saved.presetSelectionVersion,1)
    assert.deepEqual(saved.presetSelections.other,{mode:'template',template:'work'})
    assert.equal(Object.hasOwn(saved.presetSelections,'roleplay'),enabled)
    if(enabled)assert.deepEqual(saved.presetSelections.roleplay,{mode:'none'})
    assert.deepEqual(saved.templates,value.templates);assert.deepEqual(saved.workspaceOverrides,value.workspaceOverrides)
    await edit('preset',{id:'roleplay',mode:'default'},8)
    assert.deepEqual(ctl.getSnapshot().value.presetSelections.roleplay,{mode:'default'})
    await edit('active',{name:'work'},9);assert.deepEqual(ctl.getSnapshot().value.presetSelections.roleplay,{mode:'default'})
  }
})

test('roster changes never prune mappings and renamed/re-registered IDs recover their selection',async()=>{
 const p=page();p.ctl.replace({value:{...config(),presetSelectionVersion:1,presetSelections:{roleplay:{mode:'template',template:'work'},hidden:{mode:'none'}}}})
 p.tree();await new Promise(setImmediate)
 assert.equal(p.select('Roleplay · roleplay').props.value,'template:work')
 p.roster.rows=p.roster.rows.filter(r=>r.id!=='roleplay');await p.button('刷新').props.onClick();await new Promise(setImmediate)
 assert.equal(nodes(p.tree(),n=>n.props['data-preset-id']==='roleplay').length,0)
 assert.deepEqual(p.ctl.getSnapshot().value.presetSelections.roleplay,{mode:'template',template:'work'})
 p.roster.rows.push({id:'new-id',name:'New mode'},{id:'roleplay',name:'Renamed RP'});await p.button('刷新').props.onClick();await new Promise(setImmediate)
 assert.equal(p.select('New mode · new-id').props.value,'default');assert.equal(p.select('Renamed RP · roleplay').props.value,'template:work')
 p.roster.fail=true;await p.button('刷新').props.onClick();await new Promise(setImmediate)
 assert.ok(textOf(p.tree()).includes('无法读取宿主预设'));assert.deepEqual(p.ctl.getSnapshot().value.presetSelections.hidden,{mode:'none'})
})

test('deleted mapped template stays unresolved and never silently inherits another template',async()=>{
 const {plugin}=client(),ctl=controller({...config(),presetSelectionVersion:1,presetSelections:{roleplay:{mode:'template',template:'work'}}}),edit=plugin.createEditor(ctl)
 await edit('delete',{name:'work'},7);assert.deepEqual(ctl.getSnapshot().value.presetSelections.roleplay,{mode:'template',template:'work'})
 assert.equal(resolveSelection(ctl.getSnapshot().value,'D:\\Project','roleplay').text,'')
 const p=page();p.ctl.replace({value:ctl.getSnapshot().value});p.tree();await new Promise(setImmediate)
 assert.equal(p.select('Roleplay · roleplay').props.value,'template:work')
 assert.ok(p.select('Roleplay · roleplay').children.some(o=>o.props.value==='template:work'&&o.props.disabled))
})

test('preset cards use official localized names, retain registered extension names and exact IDs',async()=>{
  const p=page();p.roster.rows=[{id:'standard'},{id:'ptc'},{id:'minimal'},{id:'cordis'},{id:'unknown-id',name:'第三方自定名'},{id:'standard-custom',name:'Named override'}]
  p.tree();await new Promise(setImmediate)
  const names=()=>nodes(p.tree(),n=>n.props.className==='pt-presetName').map(textOf)
  for(const name of ['标准模式','PTC 模式','极简模式','创造模式','第三方自定名'])assert.ok(names().includes(name))
  assert.ok(nodes(p.tree(),n=>n.props.className==='pt-presetId').some(n=>textOf(n)==='standard'))
  assert.equal(nodes(p.tree(),n=>n.type==='input'&&n.props.type==='checkbox').length,0)
  p.locale('en');assert.ok(names().includes('Standard mode'));assert.ok(names().includes('第三方自定名'))
  p.roster.rows=[{id:'standard',name:'Published custom name'}];await p.button('Refresh').props.onClick();await new Promise(setImmediate)
  assert.ok(names().includes('Published custom name'));assert.ok(!names().includes('Standard mode'))
})

test('write lock prevents rapid double saves; unavailable refresh retains draft',async()=>{
  const p=page()
  let release
  p.ctl.gate=new Promise(resolve=>{release=resolve})
  const select=p.select('默认模板')
  const first=select.props.onChange({target:{value:'work'}})
  await select.props.onChange({target:{value:''}})
  assert.equal(p.ctl.calls.length,1)
  release();await first;await new Promise(setImmediate);p.ctl.gate=null
  assert.equal(p.ctl.getSnapshot().value.activeTemplate,'work')
  p.button('添加模板').props.onClick()
  nodes(p.tree(),n=>n.type==='input')[0].props.onChange({target:{value:'held'}})
  p.ctl.replace({status:'unavailable'})
  assert.equal(p.button('刷新').props.disabled,false)
  await p.button('刷新').props.onClick()
  assert.equal(nodes(p.tree(),n=>n.type==='input')[0].props.value,'held')
  p.ctl.replace({status:'ready',revision:10})
  p.events['connection/reset']()
  await p.button('保存').props.onClick()
  assert.equal(p.ctl.calls.length,1)
})

test('failed mirror refresh or reconnect during load cannot acknowledge a stale draft',async()=>{
  const p=page()
  p.button('添加模板').props.onClick()
  nodes(p.tree(),n=>n.type==='input')[0].props.onChange({target:{value:'draft'}})
  p.events['connection/reset']()
  p.refresh.error='SYNTHETIC_FAILURE'
  await p.button('刷新').props.onClick()
  await p.button('保存').props.onClick()
  assert.equal(p.ctl.calls.length,0)
  p.refresh.error=null
  p.refresh.load=async()=>{p.events['connection/reset']()}
  await p.button('刷新').props.onClick()
  await p.button('保存').props.onClick()
  assert.equal(p.ctl.calls.length,0)
  assert.equal(nodes(p.tree(),n=>n.type==='input')[0].props.value,'draft')
})

test('page edit, preview, scope controls and deletion update the same saved configuration',async()=>{
  const p=page()
  function rowButton(name,label) {
    const row=nodes(p.tree(),n=>n.props.className==='pt-item'&&n.children[0]?.children?.[0]===name)[0]
    assert.ok(row)
    return nodes(row,n=>n.type==='button'&&textOf(n)===label)[0]
  }
  rowButton('work','预览').props.onClick()
  assert.ok(nodes(p.tree(),n=>n.props.className==='pt-previewBody').some(n=>textOf(n)===config().templates[1].text))
  rowButton('work','编辑').props.onClick()
  nodes(p.tree(),n=>n.type==='textarea')[0].props.onChange({target:{value:'SYNTHETIC_EDITED'}})
  await p.button('保存').props.onClick()
  for (const [value,mode] of [['__inherit__','inherit'],['','none'],['work','template']]) {
    p.select('按工作区覆盖: Synthetic project').props.onChange({target:{value}});await new Promise(setImmediate)
    assert.equal(resolveSelection(p.ctl.getSnapshot().value,'D:\\Project').mode,mode)
  }
  p.select('默认模板').props.onChange({target:{value:'work'}});await new Promise(setImmediate)
  p.target().props.onChange({target:{value:'project'}})
  assert.ok(nodes(p.tree(),n=>n.props.className==='pt-previewBody').some(n=>textOf(n)==='SYNTHETIC_EDITED'))
  await rowButton('work','删除').props.onClick()
  assert.equal(p.ctl.getSnapshot().value.activeTemplate,'')
  assert.equal(p.ctl.getSnapshot().value.workspaceOverrides['D:\\Project'],'')
  assert.ok(textOf(p.tree()).includes('此工作区不注入'))
  assert.equal(nodes(p.tree(),n=>n.props.className==='pt-previewBody').length,0)
})
