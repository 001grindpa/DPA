async function main() {
  const Habits = await ethers.getContractFactory("Habits");
  const contract = await Habits.deploy();                   // Deploy

  await contract.waitForDeployment();  // ← Correct way in ethers v6

  // console.log("Habits deployed to:", await contract.getAddress());
  console.log(await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
