// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Interest Rate Modes for lending protocols
 * @dev Defines the type of interest rate modes available for debts in the lending protocol.
 */
enum InterestRateMode {
    NONE,
    STABLE,
    VARIABLE
}

interface IPool {
    /**
     * @notice Supplies an asset into the pool.
     * @param asset The address of the asset to be supplied.
     * @param amount The amount of the asset to supply.
     * @param onBehalfOf The address for which the supply is being made.
     * @param referralCode A code used for referral rewards.
     */
    function supply(
        address asset, 
        uint256 amount, 
        address onBehalfOf, 
        uint16 referralCode
    ) external;

    /**
     * @notice Borrows an asset from the pool.
     * @param asset The address of the asset to borrow.
     * @param amount The amount of the asset to borrow.
     * @param interestRateMode The interest rate mode (e.g., STABLE or VARIABLE).
     * @param referralCode A code used for referral rewards.
     * @param onBehalfOf The address for which the borrow is being made.
     */
    function borrow(
        address asset, 
        uint256 amount, 
        InterestRateMode interestRateMode, 
        uint16 referralCode, 
        address onBehalfOf
    ) external;

    /**
     * @notice Repays a borrowed asset back into the pool.
     * @param asset The address of the borrowed asset.
     * @param amount The amount to repay.
     * @param interestRateMode The interest rate mode of the debt being repaid (STABLE or VARIABLE).
     * @param onBehalfOf The address on behalf of which the repayment is made.
     */
    function repay(
        address asset, 
        uint256 amount, 
        InterestRateMode interestRateMode, 
        address onBehalfOf
    ) external returns (uint256);
}
