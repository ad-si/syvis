import defaultMember from 'module-name'
import * as name from 'module-name'
import { member } from 'module-name'
import { member as alias } from 'module-name'
import { member1 , member2 } from 'module-name'
import { member1 , member2 as alias2 } from 'module-name'
import defaultMember, { member1, member2 } from 'module-name'
import defaultMember, * as name from 'module-name'
import 'module-name'


export { name1, name2, nameN }
export { variable1 as name1, variable2 as name2, nameN }
export let name1, name2, nameN
export let name1 = 'name1', name2 = 'name2', nameN

export default expression
export default function () { return 0 }
export default function name1 () { return 1 }
export { name1 as default }

export * from './test.js'
export { name1, name2, nameN } from './test.js'
export { import1 as name1, import2 as name2, nameN } from './test.js'
