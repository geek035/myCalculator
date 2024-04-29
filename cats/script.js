var cachedData = {
    'n': null,
    'b': null,
    'm': null,
    't': null,
    'r': null,
    },

    cachedOptions = {
        'interval': 2,
    }

document.querySelector(".input").addEventListener('keyup', event => {
    if (event.target.tagName == "INPUT" &&
            /\d/.test(event.key)) {
        
        cachedData[event.target.name] = +event.target.value;

    } else if (event.key == 'ArrowLeft' || event.key == 'ArrowRight' 
            || event.key == 'Delete' || event.key == 'Backspace') {
        
        cachedData[event.target.name] = event.target.value == "" ? null : +event.target.value;
            
    } else {
        event.preventDefault();
    }
});

document.querySelector(".options").addEventListener('keyup', event => {
    if (event.target.tagName == "INPUT" &&
            /\d/.test(event.key)) {
        
        cachedOptions[event.target.name] = +event.target.value;

    } else if (event.key == 'ArrowLeft' || event.key == 'ArrowRight' 
            || event.key == 'Delete' || event.key == 'Backspace') {
        
        cachedOptions[event.target.name] = event.target.value == "" ? 2 : +event.target.value;
            
    } else {
        event.preventDefault();
    }
});

document.getElementById("return-button").addEventListener('click', event => {
    document.querySelector(".progress").style.display = "none";
    document.querySelector('.progress-form-timer').textContent = "";
    document.getElementById('return-button').style.display = "none";
    document.querySelector(".input").style.display = "flex";
});

document.getElementById("confirm-button").addEventListener('click', event => {
    if (Object.values(cachedData).every(data => data != null)) {
        if (cachedData['b'] > cachedData['m']) {
            showPopup("Корм уже валится из миски. Котику столько не съесть.", 2000);
        } else {
            document.querySelector(".input").style.display = "none";
            document.querySelector(".progress").style.display = "flex";
            showPopup("Миска уже полная, а котики бегут кушать", 1000);
            emulateProcess(cachedData, cachedOptions, document.querySelector('.progress-form-data'),
                    document.querySelector('.progress-form-timer'));
        }
    } else {
        showPopup("Не все данные заполнены", 1000);
    }
});

function emulateProcess(data, options, textField, timer) {
    return new Promise(function(resolve, reject) {
        let action = 0, 
            cat = 1,
            time = 0,
            counter = 1,
            feed = data.m,
            interval = options['interval']*1000;

        console.log(options);
        makeAction();

        function makeAction() {
            switch (action) {
                /* Котик подходит к писке */
                case 0:
                    if (cat > data.n) {
                        textField.textContent = 'Все котики поели. Спасибо, что накормили';
                        document.getElementById('return-button').style.display = "inline";
                        resolve("succesfull");
                    } else {
                        textField.textContent = `${cat} котик подходит к миске`
                        action = 1;
                        setTimeout(makeAction, interval);
                    }
                break;

                /* Котик ест корм */
                case 1:  
                    if (feed - data.b < 0) {    // вызываем бабушку
                        textField.textContent = 'Корма для котика не хватит. Бабушка хочет заполнить миску';
                        [action, counter] = [2, 1]
                        feed = data.m;
                        setTimeout(makeAction, interval);  
                    } else if (counter > data.t) {
                        textField.textContent = `${cat} котик поел и уходит довольный`;
                        feed -= data.b;
                        time += (counter - 1);
                        [action, counter] = [0, 1];
                        cat++;
                        setTimeout(makeAction, interval);
                    } else {
                        textField.textContent = `${cat} котик ест корм`;
                        timer.textContent = `Время: ${time + counter}`;
                        counter++;
                        setTimeout(makeAction, interval);
                    }
                break;

                    /* бабушка накладывает корм */
                case 2:  
                    if (counter > data.r) {
                        textField.textContent = 'Бабушка наложила корм. Приятного аппетика котикам';
                        time += (counter - 1);
                        [action, counter] = [1, 1];
                        setTimeout(makeAction, interval);
                    } else {
                        textField.textContent = 'Бабушка накладывает корм';
                        timer.textContent = `Время: ${time + counter}`
                        counter++;
                        setTimeout(makeAction, interval);
                    }
                break;
            }
        }
    });
}

function hideInputForm() {
    document.querySelector(".input").style.display = "none";
}
 
function showPopup(text, timeout) {
    const popupOverlay = document.getElementById("popup-overlay");
    popupOverlay.style.display = "block";
    popupOverlay.childNodes[1].childNodes[1].textContent = text;
    setTimeout(hidePopup, timeout);

    function hidePopup() {
        popupOverlay.firstChild.textContent = "";
        popupOverlay.style.display = "none";
    }
}

