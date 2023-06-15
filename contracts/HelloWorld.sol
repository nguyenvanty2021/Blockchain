// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;
contract Hello {
    // fixed-size types
    bool isEnabled // true, false
    uint a // 1,2,4
    address sender // 0xf9dk...94040
    bytes32 data // lưu số hay chữ đều cũng được nhưng độ dài tối đa là 32 byte
    // variable-size types
    string name; // "hello world"
    bytes data; // lưu bao nhiêu cũng được, lưu bao nhiêu thì chiếm bấy nhiêu bộ nhớ thôi
    unit[] amounts; // [1,4,3,2]
    mapping (address --> bool) whitelist; // 0x343...4343 --> true
    // user define
    struct User {
        uint id;
        string name;
        bool isFriend;
    }
    enum Color {
        red,
        green,
        blue
    } // Color.red
    // built-in
    msg.sender
    msg.value
    // another
    uint value;
    function getValue() external view returns(uint) {
        return value;
    }
    function setValue(uint _value) external { // parameter
        value = _value;
    }
}
