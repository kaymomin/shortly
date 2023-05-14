pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EvenPrizeDistribution {

    event PrizesDistributed(address indexed sender, address indexed tokenAddress, uint256 totalPrizeMoney, uint256 prizePerRecipient, uint256 recipientCount);

    function distributePrizes(IERC20 token, address[] memory recipients, uint256 totalPrizeMoney) public {
        uint256 recipientCount = recipients.length;
        require(recipientCount > 0, "No recipients provided");
        require(token.balanceOf(msg.sender) >= totalPrizeMoney, "Sender has insufficient token balance");

        uint256 prizePerRecipient = totalPrizeMoney / recipientCount;
        uint256 remainder = totalPrizeMoney % recipientCount;

        for (uint256 i = 0; i < recipientCount; i++) {
            uint256 prize = prizePerRecipient;
            if (i == recipientCount - 1) {
                prize += remainder; // Add remainder to the last recipient's prize
            }
            token.transferFrom(msg.sender, recipients[i], prize);
        }

        emit PrizesDistributed(msg.sender, address(token), totalPrizeMoney, prizePerRecipient, recipientCount);
    }
}