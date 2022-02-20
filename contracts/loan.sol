pragma solidity ^0.4.21;

// Initial Code by
// https://programtheblockchain.com/posts/2018/03/06/writing-a-collateralized-loan-contract/

import "./HederaTokenService.sol";
import "./HederaResponseCodes.sol";

contract Loan is HederaTokenService {
    address public lender;
    address public borrower;
    uint256 public collateralAmount;
    uint256 public payoffAmount;
    uint256 public dueDate;

    function Loan(
        address _lender,
        address _borrower,
        uint256 _collateralAmount,
        uint256 _loanAmount,
        uint256 loanDuration
    )
        public
    {
        lender = _lender;
        borrower = _borrower;
        token = ;
        collateralAmount = _collateralAmount;
        payoffAmount = _loanAmount;
        dueDate = now + loanDuration;
    }

    event LoadRequestAccepted(address loan);
    event LoanPaid();

    function payLoan() public payable {
        require(now <= dueDate);
        require(msg.value == payoffAmount);

        require(token.transfer(borrower, collateralAmount));
        emit LoanPaid();
        selfdestruct(lender);
    }

    function repossess() public {
        require(now > dueDate);

        require(token.transfer(lender, collateralAmount));
        selfdestruct(lender);
    }

    function lendHbar() public payable {
        require(msg.value == loanAmount);
        HederaTokenService.transferTokens(token, accountIds, amounts);
    }
}