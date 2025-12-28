// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Habits {
    mapping(address => mapping(uint => bool)) public checkedIn;
    mapping(address => mapping(uint => bool)) public checkedOut;

    event CheckIn(address indexed user, uint indexed day);
    event CheckOut(address indexed user, uint indexed day);

    function checkIn(uint day) public {
        checkedIn[msg.sender][day] = true;
        emit CheckIn(msg.sender, day);
    }

    function checkOut(uint day) public {
        // require(checkedIn[msg.sender][day], "Not checked in yet");
        checkedOut[msg.sender][day] = true;
        emit CheckOut(msg.sender, day);
    }
}