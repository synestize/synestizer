// http://www.2ality.com/2015/01/es6-set-operations.html
import { union as _union, difference as _difference, intersection as _intersection} from './fakesetop'
export const union = (a,b) => new Set(_union(a,b));
export const difference = (a,b) => new Set(_difference(a,b));
export const intersection = (a,b) => new Set(_intersection(a,b));
