// 2) Access Modifiers & Private Fields¶
// Add public, protected, private members to a small demo class and try accessing them.
// Convert a member to an ECMAScript private field #secret and observe access errors from outside.

class DemoClass {
  public name = "DemoClass";
  protected protectedSecret = "Only DemoClass and its children can access";
  private privateSecret = "Only DemoClass can access";
  #ecmaSecret = "Only DemoClass can access";

  getName() {
    return this.name;
  }

  getSecret() {
    return this.#ecmaSecret;
  }
}

const demo = new DemoClass();

console.log(demo.name);
// console.log(demo.protectedSecret);
// console.log(demo.privateSecret);
// console.log(demo.#ecmaSecret);

console.log(demo.getName());
console.log(demo.getSecret());
