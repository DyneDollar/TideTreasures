const { expect } = require("chai");

describe("TideTreasures", function() {
  let TideTreasures, tideTreasures, MockDyneDollar, mockDyneDollar, MockLPtoken, mockLPtoken, addr1, addr2;

  beforeEach(async () => {
    MockDyneDollar = await ethers.getContractFactory("MockDyneDollar");
    mockDyneDollar = await MockDyneDollar.deploy();
    console.log("Deployed MockDyneDollar");

    MockLPtoken = await ethers.getContractFactory("MockLPtoken");
    mockLPtoken = await MockLPtoken.deploy();
    console.log("Deployed MockLPtoken");

    TideTreasures = await ethers.getContractFactory("TideTreasures");
    tideTreasures = await TideTreasures.deploy(mockDyneDollar.address, mockLPtoken.address);
    console.log("Deployed TideTreasures");

    [addr1, addr2, _] = await ethers.getSigners();
  })

  it("Should deploy contracts correctly", async function() {

   console.log(" TideTreasures address", tideTreasures.address);
   console.log(" MockDyneDollar address", mockDyneDollar.address);
   console.log(" MockLPtoken address", mockLPtoken.address);
  });
});
