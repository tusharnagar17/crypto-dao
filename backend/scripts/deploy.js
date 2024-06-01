const hre = require("hardhat")

async function sleep(ms){
    return new Promise((resolve)=> setTimeout(resolve, ms))
}

async function main() {
    // Deploy the Nft Contract
    const nftContract = await hre.ethers.deployContract("CryptoDevsNFT");
    await nftContract.waitForDeployment();
    console.log("CryptoDevsNft Deployed to: ", nftContract.target);
    
    // Deploy the Face Marketplace Contract
    const fakeNftMarketplaceContract = await hre.ethers.deployContract("FakeNFTMarketplace")
    await fakeNftMarketplaceContract.waitForDeployment();

    console.log("FakeNFTMarketplace deployed to:", fakeNftMarketplaceContract)

    // Deploy the DAO contract
    const daoContract = await hre.ethers.deployContract("CryptoDevsDAO", [
        fakeNftMarketplaceContract.target,
        nftContract.target
    ], {value: amount,});
    await daoContract.waitForDeployment();
    console.log("CryptoDevsDAO deployed to:", daoContract.target)

    // Sleep for 30 seconds to let Etherscan catch up with the deployments
    await sleep(30*1000)

    // Verify the NFT Contract
    await hre.run("verify:verify", {
        address: nftContract.target,
        constructorArguments: [],
    })

    // Verify the Fake Marketplace Contract
    await hre.run("verify:verify", {
        address: fakeNftMarketplaceContract.target,
        constructorArguments: [],
    })

    // Verify the DAO Contract
    await hre.run("verify:verify", {
        address: daoContract.target,
        constructorArguments: [
            fakeNftMarketplaceContract.target,
            nftContract.target
        ],
    })
}

main().catch((error)=> {
    console.error(error);
    process.exitCode = 1;
})