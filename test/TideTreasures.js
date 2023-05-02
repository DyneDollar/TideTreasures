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
  await mockLPtoken.connect(addr1).mint(addr1.address, 7);
  console.log("Minted 7 LP token");

  // Approve the staking contract to handle the LP token
  await mockLPtoken.connect(addr1).approve(tideTreasures.address, 7);
  console.log("Approved 7 LP token");

  // Stake the LP token
  await tideTreasures.connect(addr1).stake(7);
  console.log("Staked 7 LP token");


  console.log(" getting the balance:");
  const stakedBalance = await getStakedBalance(addr1);
  console.log(`Staked balance for addr1: ${stakedBalance}`);








});


///------------------ TESTS Stake Balance ------------------//
async function getStakedBalance(user) {
  let balance = 0;
  const stakes = await tideTreasures.getStakes(user.address);
  
  for (let i = 0; i < stakes.length; i++) {
    balance += stakes[i].amount;
  }

  return balance;
}








});
