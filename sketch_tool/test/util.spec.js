import { baseWithMixins } from 'sketch2/util';

describe('The mixin helper utility', () => {
    it('should extend a base class with mixin properties', () => {
        class Base {
            constructor() {
                this.instProperty = 'instProperty';
            }
            baseMethod() {}
        }

        let mixin = {
            mixinMethod() {},
            mixinProperty: ['mixinProperty'],  // use an array for toBe comparisons
        };

        let Mixed = baseWithMixins(Base, mixin);
        let mixedInstance = new Mixed();

        // Methods inherit without copying:
        expect(Mixed.prototype.baseMethod).toBe(Base.prototype.baseMethod);

        // The constructor is copied from the base, and works:
        expect(mixedInstance.instProperty).toEqual('instProperty');

        // Non-method mixin properties end up being mixed into the *prototype*:
        expect(Mixed.prototype.mixinProperty).toBe(mixin.mixinProperty);
    });

    it('should allow multiple mixins, giving highest priority to those furthest right', () => {
        class Base {
            baseMethod1() {} // Overridden by mixinA
            baseMethod2() {} // Overridden by mixinB
            baseMethod3() {}
        }

        let mixinA = {
            baseMethod1() {}, // Overrides Base#baseMethod1
            mixinMethodA1() {},
            mixinMethodA2() {},
        };

        let mixinB = {
            baseMethod2() {}, // Overrides Base#baseMethod2
            mixinMethodA1() {}, // Overrides mixinA.mixinMethodA1
            mixinMethodB() {},
        };

        let Mixed = baseWithMixins(Base, mixinA, mixinB);

        expect(Mixed.prototype.baseMethod1).toBe(mixinA.baseMethod1);
        expect(Mixed.prototype.baseMethod2).toBe(mixinB.baseMethod2);
        expect(Mixed.prototype.baseMethod3).toBe(Base.prototype.baseMethod3);

        expect(Mixed.prototype.mixinMethodA1).toBe(mixinB.mixinMethodA1);
        expect(Mixed.prototype.mixinMethodA2).toBe(mixinA.mixinMethodA2);

        expect(Mixed.prototype.mixinMethodB).toBe(mixinB.mixinMethodB);
    });

    it('should return a class that can itself be extended', () => {
        let mixin = {
            mixinMethod() {},
        };

        class Extended extends baseWithMixins(Object, mixin) {}
        let extendedInstance = new Extended();

        expect(extendedInstance.mixinMethod).toBe(mixin.mixinMethod);
    });
});
