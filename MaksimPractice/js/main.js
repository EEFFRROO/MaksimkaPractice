$(document).ready(() => {
    const STORAGE_NAME = "cities";

    const newCityName = $(".nameNewCity");
    const newCityTimestamp = $(".timestampNewCity");
    $(".addNewPurchaseBtn").on("click", function () {
        const city = newCityName.val();
        const timeStamp = newCityTimestamp.val();
        if (!checkUniqueCity(city)) {
            alert("Город уже указан");
        } else if (!Number.isFinite(timeStamp)) {
            alert("Часовой пояс должен быть числом");
        } else {
            $(".cities").append(createCityInfo(city, timeStamp));
            addCityToStorage(city, timeStamp);
            newCityName.val('')
            newCityTimestamp.val('')
        }
    })
    readFromStorage();
    setInterval(() => {
        updateTime()
    }, 1000)

    function createCityInfo(city, timeStamp) {
        const tr = $("<tr/>");
        const tdName = $("<td/>");
        tdName.text(city);
        tdName.addClass("cityName");
        const tdTime = $("<td/>");
        tdTime.addClass("cityTime");
        const tdTimestamp = $("<td/>");
        tdTimestamp.addClass("cityTimestamp");
        tdTimestamp.text("+" + parseInt(timeStamp));
        const currentDate = Date.now();
        tdTime.text(new Date(currentDate + (timeStamp * 60 * 60 * 1000)).toUTCString())
        const editTd = $("<td/>");
        const editBtn = createEditBtn();
        editTd.addClass("p-0")
        editTd.append(editBtn);
        const deleteTd = $("<td/>");
        const deleteBtn = createDeleteBtn();
        deleteTd.addClass("p-0")
        deleteTd.append(deleteBtn);
        tr.addClass("city");
        tr.append(tdName);
        tr.append(tdTimestamp);
        tr.append(tdTime);
        tr.append(editTd);
        tr.append(deleteTd);
        return tr;
    }

    function updateTime() {
        $(".cityTime").each(function () {
            let timeStamp = $(this).closest("tr").children(".cityTimestamp");
            $(this).text(new Date(Date.now() + (timeStamp.text() * 60 * 60 * 1000)).toUTCString());
        })
    }

    function checkUniqueCity(city) {
        let storage = localStorage.getItem(STORAGE_NAME);
        if (!storage) {
            storage = [];
        } else {
            storage = JSON.parse(storage);
        }
        for (let i = 0; i < storage.length; i++) {
            if (storage[i].city === city) {
                return false;
            }
        }
        return true;
    }

    function addCityToStorage(city, timeStamp) {
        let storage = localStorage.getItem(STORAGE_NAME);
        if (!storage) {
            storage = [];
        } else {
            storage = JSON.parse(storage);
        }
        data = { city: city, timeStamp: timeStamp };
        storage.push(data);
        storage = JSON.stringify(storage);
        localStorage.setItem(STORAGE_NAME, storage);
    }

    function readFromStorage() {
        let storage = localStorage.getItem(STORAGE_NAME);
        if (storage) {
            storage = JSON.parse(storage);
            for (let i = 0; i < storage.length; i++) {
                $(".cities").append(createCityInfo(storage[i].city, storage[i].timeStamp));
            }
        }
    }

    function deleteCityFromStorage(city) {
        let storage = localStorage.getItem(STORAGE_NAME);
        if (storage) {
            storage = JSON.parse(storage);
            tempStorage = [];
            for (let i = 0; i < storage.length; i++) {
                if (storage[i].city !== city) {
                    tempStorage.push(storage[i]);
                }
            }
        }
        tempStorage = JSON.stringify(tempStorage);
        localStorage.setItem(STORAGE_NAME, tempStorage);
    }

    function editCity(city, timeStamp, oldName) {
        let storage = localStorage.getItem(STORAGE_NAME);
        if (storage) {
            storage = JSON.parse(storage);
            tempStorage = [];
            for (let i = 0; i < storage.length; i++) {
                if (storage[i].city !== oldName) {
                    tempStorage.push(storage[i]);
                } else {
                    tempStorage.push({ city: city, timeStamp: timeStamp });
                }
            }
        }
        tempStorage = JSON.stringify(tempStorage);
        localStorage.setItem(STORAGE_NAME, tempStorage);
    }

    function createDeleteBtn() {
        let deleteBtn = $(`<button class='deleteBtn btn btn-outline-danger px-3'>&#10008;</button>`);
        deleteBtn.click(function () {
            deleteCityFromStorage($(this).closest("tr").children(".cityName").text());
            $(this).closest("tr").remove();
        });
        return deleteBtn;
    }

    function createEditBtn() {
        let editBtn = $(`<button class='editBtn btn btn-outline-info px-2.5'>&#9998;</button>`);
        editBtn.click(function () {
            let tr = $(this).closest("tr");
            let cityName = tr.children(".cityName");
            let cityTimestamp = tr.children(".cityTimestamp");
            let inputName = $("<input class='cityNameInput'>");
            let inputTimestamp = $("<input class='cityTimestampInput'>");
            inputName.val(cityName.text())
            inputTimestamp.val(cityTimestamp.text())
            editBtn.replaceWith(createAcceptEditBtn(cityName.text()));
            cityName.text("")
            cityName.append(inputName);
            cityTimestamp.text("")
            cityTimestamp.append(inputTimestamp);
        });
        return editBtn;
    }

    function createAcceptEditBtn(oldName) {
        let acceptBtn = $("<button class='btn btn-outline-success px-2.5'>&#10003;</button>");
        acceptBtn.click(function () {
            let tdCityName = $(this).closest("tr").children(".cityName")
            let cityName = tdCityName.children(".cityNameInput")
            let tdCityTimestamp = $(this).closest("tr").children(".cityTimestamp")
            let cityTimestamp = tdCityTimestamp.children(".cityTimestampInput")
            tdCityName.text(cityName.val())
            tdCityTimestamp.text(cityTimestamp.val())
            cityName.remove()
            cityTimestamp.remove()
            editCity(tdCityName.text(), tdCityTimestamp.text(), oldName);
            acceptBtn.replaceWith(createEditBtn());
        });
        return acceptBtn;
    }
})