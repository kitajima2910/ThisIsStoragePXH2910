window.requestAnimationFrame(poll);

let buttonStates = {}; // Trạng thái của các nút

let keyboard0 = {
    DPad_Up: 87,
    DPad_Down: 83,
    DPad_Left: 65,
    DPad_Right: 68,
};

let keyboard1 = {
    DPad_Up: 38,
    DPad_Down: 40,
    DPad_Left: 37,
    DPad_Right: 39,
};

function poll() {
    window.requestAnimationFrame(poll);

    let gamepads = navigator.getGamepads();

    let gamepadIndex0 = gamepads[0];
    let gamepadIndex1 = gamepads[1];

    // Lấy saveDevices từ Android
    let saveDevices = [-1, -1];
    if (window.Android) {
        let jsonSaveDevices = Android.getGameControllerIds();
        saveDevices = JSON.parse(jsonSaveDevices);
    }

    var gamepadIndexReals = JSON.parse(localStorage.getItem("gamepadIndexReals")) || ["", ""];

    // localStorage.setItem("gamepadIndexReals", JSON.stringify([gamepadIndex0 ? "" : gamepadIndex0.id, gamepadIndex1 ? "" : gamepadIndex1.id]));

    for (let i = 0; i < gamepads.length; i++) {
        const gamepad = gamepads[i];
        if (gamepad) {
            console.log("=======================================");
            console.log(`Gamepad Index: ${gamepad.index}`);
            console.log(`Gamepad ID: ${gamepad.id}`); // ID bao gồm thông tin Vendor và Product
            console.log(`Gamepad Name: ${gamepad.id.split("Vendor:")[0].trim()}`); // Trích xuất tên từ ID
        }
    }

    // // Trường hợp 1: [Virtual, Virtual]
    // if (checkSlots(saveDevices[0]) == 1 && checkSlots(saveDevices[1]) == 1) {
        
    // } 

    // // Trường hợp 2: [Virtual, Empty]
    // else if (checkSlots(saveDevices[0]) == 1 && checkSlots(saveDevices[1]) == -1) {
        
    // } 

    // // Trường hợp 4: [Empty, Empty]
    // else if (checkSlots(saveDevices[0]) == -1 && checkSlots(saveDevices[1]) == -1) {
    //     localStorage.setItem("gamepadIndexReals", JSON.stringify(["", ""]));
    // }

    // // Trường hợp 5: [Virtual, Real] 
    // else if (checkSlots(saveDevices[0]) == 1 && checkSlots(saveDevices[1]) == 2) {

    //     // Tạo chuỗi nhận diện cho mỗi gamepad
    //     let gamepadIDName0 = `${saveDevices[1]}-${gamepadIndex0.id}`;
    //     processGamepad(gamepadIndex0, keyboard1);
    //     localStorage.setItem("gamepadIndexReals", JSON.stringify(["", gamepadIDName0]));
    // }

    // // Trường hợp 6: [Real, Virtual]
    // else if (checkSlots(saveDevices[0]) == 2 && checkSlots(saveDevices[1]) == 1) {
    //     // Tạo chuỗi nhận diện cho mỗi gamepad
    //     let gamepadIDName0 = `${saveDevices[0]}-${gamepadIndex0.id}`;
    //     processGamepad(gamepadIndex0, keyboard0);
    //     localStorage.setItem("gamepadIndexReals", JSON.stringify([gamepadIDName0, ""]));
    // }

    // // Trường hợp 7: [Real1, Real2] hoặc [Real2, Real1]
    // else if (checkSlots(saveDevices[0]) == 2 && checkSlots(saveDevices[1]) == 2) {
    //     // Tạo chuỗi nhận diện cho mỗi gamepad
    //     let gamepadIDName0 = `${saveDevices[0]}-${gamepadIndex0.id}`;
    //     let gamepadIDName1 = `${saveDevices[1]}-${gamepadIndex1.id}`;

    //     // Kiểm tra và xử lý ánh xạ với keyboard
    //     if (gamepadIDName0 === gamepadIndexReals[0]) {
    //         processGamepad(gamepadIndex0, keyboard0); // Gamepad0 gắn với keyboard0
    //     } else if (gamepadIDName0 === gamepadIndexReals[1]) {
    //         processGamepad(gamepadIndex0, keyboard1); // Gamepad0 gắn với keyboard1
    //     } else {
    //         processGamepad(gamepadIndex0, keyboard0); // Mặc định gắn với keyboard0
    //     }

    //     if (gamepadIDName1 === gamepadIndexReals[1]) {
    //         processGamepad(gamepadIndex1, keyboard1); // Gamepad1 gắn với keyboard1
    //     } else if (gamepadIDName1 === gamepadIndexReals[0]) {
    //         processGamepad(gamepadIndex1, keyboard0); // Gamepad1 gắn với keyboard0
    //     } else {
    //         processGamepad(gamepadIndex1, keyboard1); // Mặc định gắn với keyboard1
    //     }

    //     // Cập nhật lại ánh xạ trong localStorage
    //     localStorage.setItem("gamepadIndexReals",JSON.stringify([gamepadIDName0, gamepadIDName1]));
    // }

    // // Trường hợp 8: [Real, Empty]
    // else if (checkSlots(saveDevices[0]) == 2 && checkSlots(saveDevices[1]) == -1) {
    //     // Tạo chuỗi nhận diện cho mỗi gamepad
    //     let gamepadIDName0 = `${saveDevices[0]}-${gamepadIndex0.id}`;
    //     processGamepad(gamepadIndex0, keyboard0);
    //     localStorage.setItem("gamepadIndexReals", JSON.stringify([gamepadIDName0, ""]));
    // }

    // // Trường hợp 9: [Empty, Real]
    // else if (checkSlots(saveDevices[0]) == -1 && checkSlots(saveDevices[1]) == 2) {
    //     // Tạo chuỗi nhận diện cho mỗi gamepad
    //     let gamepadIDName0 = `${saveDevices[1]}-${gamepadIndex0.id}`;
    //     processGamepad(gamepadIndex0, keyboard1);
    //     localStorage.setItem("gamepadIndexReals", JSON.stringify(["", gamepadIDName0]));
    // }

}

function checkSlots(value) {
    if (value == 6496 || value == 3694) {
        return 1; // Virtual gamepad
    }        
    return value == -1 ? -1 : 2; // -1: Empty, 2: Real gamepad
}

function dispatchEventCustom(event, keyCode) {
    document.dispatchEvent(
        new KeyboardEvent(event, {
            keyCode: keyCode,
            which: keyCode,
        })
    );
}

function processGamepad(gamepadIndex, keyboard) {
    if (gamepadIndex) {
        // gamepadIndex.axes.forEach((axis, i) => {
        //     if (i === 0) {
        //         console.log("PXH_2910: Left Analog X: " + axis.toFixed(2));
        //     }
        //     if (i === 1) {
        //         console.log("PXH_2910: Left Analog Y: " + axis.toFixed(2));
        //     }
        //     if (i === 2) {
        //         console.log("PXH_2910: Right Analog X: " + axis.toFixed(2));
        //     }
        //     if (i === 3) {
        //         console.log("PXH_2910: Right Analog Y: " + axis.toFixed(2));
        //     }
        // });

        gamepadIndex.buttons.forEach((button, i) => {
            let isPressed = button.pressed;

            // Kiểm tra trạng thái trước đó
            if (buttonStates[i] !== isPressed) {
                buttonStates[i] = isPressed; // Cập nhật trạng thái

                if (isPressed) {
                    if (i === 0) console.log("PXH_2910: Button A Pressed");
                    if (i === 1) console.log("PXH_2910: Button B Pressed");
                    if (i === 2) console.log("PXH_2910: Button X Pressed");
                    if (i === 3) console.log("PXH_2910: Button Y Pressed");
                    if (i === 4) console.log("PXH_2910: Left Shoulder Pressed");
                    if (i === 5)
                        console.log("PXH_2910: Right Shoulder Pressed");
                    if (i === 6)
                        console.log("PXH_2910: Left Shoulder Trigger Pressed");
                    if (i === 7)
                        console.log("PXH_2910: Right Shoulder Trigger Pressed");
                    if (i === 8) console.log("PXH_2910: Back Pressed");
                    if (i === 9) console.log("PXH_2910: Start Pressed");
                    if (i === 10)
                        console.log("PXH_2910: Left Analog Button Pressed");
                    if (i === 11)
                        console.log("PXH_2910: Right Analog Button Pressed");

                    if (i === 12) dispatchEventCustom("keydown", keyboard.DPad_Up); // Up
                    if (i === 13) dispatchEventCustom("keydown", keyboard.DPad_Down); // Down
                    if (i === 14) dispatchEventCustom("keydown", keyboard.DPad_Left); // Left
                    if (i === 15) dispatchEventCustom("keydown", keyboard.DPad_Right); // Right
                } else {
                    if (i === 12) dispatchEventCustom("keyup", keyboard.DPad_Up); // Up
                    if (i === 13) dispatchEventCustom("keyup", keyboard.DPad_Down); // Down
                    if (i === 14) dispatchEventCustom("keyup", keyboard.DPad_Left); // Left
                    if (i === 15) dispatchEventCustom("keyup", keyboard.DPad_Right); // Right
                }
            }
        });
    }
}
