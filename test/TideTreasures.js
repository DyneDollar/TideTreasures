const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TideTreasures", function() {
  let dyneDollar;
  let lpToken;
  let tideTreasures;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function() {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const MockDyneDollar = await ethers.getContractFactory("MockDyneDollar");
    dyneDollar = await MockDyneDollar.deploy();
    await dyneDollar.deployed();

    const MockLPtoken = await ethers.getContractFactory("MockLPtoken");
    lpToken = await MockLPtoken.deploy();
    await lpToken.deployed();

    const TideTreasures = await ethers.getContractFactory("TideTreasures");
    tideTreasures = await TideTreasures.deploy(dyneDollar.address, lpToken.address);
    await tideTreasures.deployed();

    // Mint some LP tokens to test accounts
    await lpToken.mint(owner.address);
    await lpToken.mint(addr1.address);
  });

  describe("Deployment", function() {
    it("Should set the right DyneDollar", async function() {
      expect(await tideTreasures.dyneDollar()).to.equal(dyneDollar.address);
    });

    it("Should set the right LP token", async function() {
      expect(await tideTreasures.lpToken()).to.equal(lpToken.address);
    });
  });

  describe("Staking and unstaking", function() {
    it("Should allow users to stake LP tokens and earn rewards", async function() {
      const amount = ethers.utils.parseEther("1");

      // Owner stakes 1 LP token
      await lpToken.connect(owner).approve(tideTreasures.address, amount);
      await tideTreasures.connect(owner).stake(amount, ethers.constants.AddressZero);
      expect(await tideTreasures.totalStakedFor(owner.address)).to.equal(amount);

      // Forward time to simulate earning some rewards
      await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7]); // forward time 7 days
      await ethers.provider.send("evm_mine");

      // Check earned rewards
      const earned = await tideTreasures.earned(owner.address);
      expect(earned).to.be.above(0);

      // Unstake and claim rewards
      await tideTreasures.connect(owner).unstake(amount, ethers.constants.AddressZero);
      expect(await tideTreasures.totalStakedFor(owner.address)).to.equal(0);
    });

    it("Should not allow users to stake more LP tokens than they have", async function() {
      const amount = ethers.utils.parseEther("2");

      await expect(
        tideTreasures.connect(addr1).stake(amount, ethers.constants.AddressZero)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
});
