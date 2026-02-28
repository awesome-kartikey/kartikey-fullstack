// Composition refactor: Take an existing PremiumUser extends User hierarchy and refactor it to use composition. Create a User type and a separate PricingPolicy strategy object. Show how combining them avoids inheritance pitfalls and improves flexibility.

class oldUser {
  constructor(public name: string) {}
}

class oldPremiumUser extends oldUser {
  getDiscount() {
    return 0.3;
  }
}
/*******************************************************************************/
// Composition

interface DiscountPolicy {
  getDiscount(): number;
}

class StandardPricingPolicy implements DiscountPolicy {
  getDiscount() {
    return 0;
  }
}

class PremiumPricingPolicy implements DiscountPolicy {
  getDiscount() {
    return 0.3;
  }
}

class newUser2 {
  constructor(
    public name: string,
    public policy: DiscountPolicy,
  ) {}
  getDiscount() {
    return this.policy.getDiscount();
  }
}

const regularUser = new newUser2("Alice", new StandardPricingPolicy());
const premiumUser = new newUser2("Bob", new PremiumPricingPolicy());
