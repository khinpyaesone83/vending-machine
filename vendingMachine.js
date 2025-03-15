const readlineSync = require("readline-sync");

class VendingMachine {
  constructor() {
    this.drinks = {
      "Coca Cola": 3.35,
      Pepsi: 2.1,
      Orange: 2.85,
    };
    this.moneyInserted = 0;
  }

  insertMoney() {
    while (true) {
      const amount = readlineSync.questionFloat(
        "Insert money (5$, 10$, 15$, 20$): "
      );
      if ([5, 10, 15, 20].includes(amount)) {
        this.moneyInserted += amount;
        console.log(`Total money inserted: $${this.moneyInserted.toFixed(2)}`);
        break;
      } else {
        console.log("Invalid amount. Please insert 5$, 10$, 15$, or 20$.");
      }
    }
  }

  selectDrink() {
    console.log("\nAvailable Drinks:");
    for (let [drink, price] of Object.entries(this.drinks)) {
      console.log(`${drink} - $${price.toFixed(2)}`);
    }

    while (true) {
      const choice = readlineSync.question("Select a drink: ").trim();
      if (this.drinks[choice]) {
        const price = this.drinks[choice];
        if (this.moneyInserted >= price) {
          this.moneyInserted -= price;
          console.log(
            `Dispensing ${choice}. Remaining balance: $${this.moneyInserted.toFixed(
              2
            )}`
          );
          return true;
        } else {
          console.log("Insufficient funds. Please insert more money.");
          this.insertMoney();
        }
      } else {
        console.log("Invalid selection. Please choose a drink from the list.");
      }
    }
  }

  run() {
    console.log("Welcome to the Vending Machine!");
    this.insertMoney();

    while (true) {
      this.selectDrink();
      const another = readlineSync
        .question("Do you want to purchase another drink? (yes/no): ")
        .toLowerCase();
      if (another !== "yes") {
        console.log("Thank you for using the vending machine. Goodbye!");
        break;
      }
    }
  }
}

const machine = new VendingMachine();
machine.run();
