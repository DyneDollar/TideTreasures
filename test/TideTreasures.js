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


 //------------------ TESTS Stake ------------------//

 it("Should allow users to stake LP tokens", async function() {
  // Mint a new LP token
  await mockLPtoken.connect(addr1).mint(addr1.address, 1);
  console.log("Minted LP token");

  // Approve the staking contract to handle the LP token
  await mockLPtoken.connect(addr1).approve(tideTreasures.address, 1);
  console.log("Approved LP token");

  // Stake the LP token
  await tideTreasures.connect(addr1).stake(1);
  console.log("Staked LP token");
});

});
