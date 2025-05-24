// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract OpenDonationSplitter {

    /**
     * @notice Split the sent ETH among recipients based on their percentage shares.
     * @param recipients Array of recipient addresses
     * @param percentages Array of corresponding percentages (in basis points: 10000 = 100%)
     */
    function donateAndSplit(
        address[] calldata recipients,
        uint256[] calldata percentages
    ) external payable {
        uint256 totalAmount = msg.value;
        uint256 totalPercentage = 0;

        require(recipients.length == percentages.length, "Mismatched array lengths");
        require(totalAmount > 0, "Must send ETH");

        // Sum percentages and validate
        for (uint256 i = 0; i < percentages.length; i++) {
            totalPercentage += percentages[i];
        }
        require(totalPercentage == 10000, "Total percentages must equal 100 (100%)");

        // Distribute ETH
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 amount = (totalAmount * percentages[i]) / 10000;
            (bool success, ) = payable(recipients[i]).call{value: amount}("");
            require(success, "Transfer failed");
        }
    }
}
