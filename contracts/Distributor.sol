pragma solidity ^0.8.0;

contract EvenPrizeDistribution {
    event PrizesDistributed(
        address indexed sender,
        uint256 totalPrizeMoney,
        uint256 prizePerRecipient,
        uint256 recipientCount
    );

    function distributePrizes(
        address[] memory recipients,
        uint256 totalPrizeMoney
    ) public payable {
        uint256 recipientCount = recipients.length;
        require(recipientCount > 0, "No recipients provided");
        require(
            msg.value == totalPrizeMoney,
            "Total prize money does not match the value sent"
        );

        uint256 prizePerRecipient = totalPrizeMoney / recipientCount;
        uint256 remainder = totalPrizeMoney % recipientCount;

        for (uint256 i = 0; i < recipientCount; i++) {
            uint256 prize = prizePerRecipient;
            if (i == recipientCount - 1) {
                prize += remainder; // Add remainder to the last recipient's prize
            }
            payable(recipients[i]).transfer(prize);
        }

        emit PrizesDistributed(
            msg.sender,
            totalPrizeMoney,
            prizePerRecipient,
            recipientCount
        );
    }
}
