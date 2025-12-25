async function main() {
  const Habits = await ethers.getContractFactory("Habits");  // Replace with your contract name
  const contract = await Habits.deploy();                   // Deploy

  await contract.waitForDeployment();  // ← Correct way in ethers v6

  console.log("Habits deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});