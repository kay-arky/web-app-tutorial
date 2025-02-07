import ToDoList from "./todolist.js"
import ToDoItem from "./todoItem.js"

const toDoList = new ToDoList()

//Launch App
document.addEventListener("readystatechange", (event) => {
	if (event.target.readyState === "complete") {
		initApp()
	}
})

const initApp = () => {
	// Add Listener
	const itemEntryForm = document.getElementById("itemEntryForm")
	itemEntryForm.addEventListener("submit", (event) => {
		event.preventDefault()
		processSubmission()
	})

	const clearItems = document.getElementById("clearItems")
	clearItems.addEventListener("click", (event) => {
		const list = toDoList.getList()
		if (list.length) {
			const confirmed = confirm(
				"are you sure you want to clear the entire list?"
			)
			if (confirmed) {
				toDoList.clearList()
				updatePersistentData(toDoList.getList())
				refreshThePage()
			}
		}
	})

	// Procedural
	// Load list
	loadListObject()
	refreshThePage()
}

const loadListObject = () => {
	const storedList = localStorage.getItem("myToDoList")
	if (typeof storedList !== "string") return
	const parsedList = JSON.parse(storedList)
	parsedList.forEach((itemObj) => {
		const newToDoItem = createNewItem(itemObj._id, itemObj._item)
		toDoList.addItemToList(newToDoItem)
	})
}

const refreshThePage = () => {
	clearListDisplay()
	renderList()
	clearItemEntryField()
	setFocusOnItemEntry()
}

const clearListDisplay = () => {
	const parentElement = document.getElementById("listItems")
	deleteContents(parentElement)
}

const deleteContents = (parentElement) => {
	let child = parentElement.lastElementChild
	while (child) {
		parentElement.removeChild(child)
		child = parentElement.lastElementChild
	}
}

const renderList = () => {
	const list = toDoList.getList()
	list.forEach((item) => {
		buildListItem(item)
	})
}

const buildListItem = (item) => {
	const div = document.createElement("div")
	div.className = "item"
	const checkbox = document.createElement("input")
	checkbox.type = "checkbox"
	checkbox.id = item.getId()
	checkbox.tabIndex = 0
	addClickListenerToCheckbox(checkbox)
	const label = document.createElement("label")
	label.htmlFor = item.getId()
	label.textContent = item.getItem()
	div.appendChild(checkbox)
	div.appendChild(label)
	const container = document.getElementById("listItems")
	container.appendChild(div)
}

const addClickListenerToCheckbox = (checkbox) => {
	checkbox.addEventListener("click", (event) => {
		toDoList.removeItemFromList(checkbox.id)
		updatePersistentData(toDoList.getList())
		const removeText = getLabelText(checkbox.id)
		updateScreenReaderConfirmation(removeText, "removed from list")
		setTimeout(() => {
			refreshThePage()
		}, 1000)
	})
}

const getLabelText = (checkboxId) => {
	return document.getElementById(checkboxId).nextElementSibling.textContent
}

const updatePersistentData = (listArray) => {
	localStorage.setItem("myToDoList", JSON.stringify(listArray))
}

const clearItemEntryField = () => {
	document.getElementById("newItem").value = ""
}

const setFocusOnItemEntry = () => {
	document.getElementById("newItem").focus()
}

const processSubmission = () => {
	const newEntryText = getNewEntry()
	if (!newEntryText.length) return
	const nextItemId = calcNextItemId()
	const toDoItem = createNewItem(nextItemId, newEntryText)
	toDoList.addItemToList(toDoItem)
	updatePersistentData(toDoList.getList())
	updateScreenReaderConfirmation(newEntryText, "added")
	refreshThePage()
}

const getNewEntry = () => {
	return document.getElementById("newItem").value.trim()
}

// const calcNextItemId = () => {
// 	let nextItemId = 1
// 	const list = toDoList.getList()
// 	if (list.length > 0) {
// 		nextItemId = list[list.length - 1].getId() + 1
// 	}
// 	return nextItemId
// }

const calcNextItemId = () => {
	let nextItemId = 1
	const list = toDoList.getList()
	if (list.length > 0) {
		nextItemId = list[list.length - 1].getId() + 1
	}
	console.log("Next Item ID:", nextItemId) // Debugging
	return nextItemId
}

const createNewItem = (itemId, itemText) => {
	const toDo = new ToDoItem()
	toDo.setId(itemId)
	toDo.setItem(itemText)
	return toDo
}

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
	document.getElementById(
		"confirmation"
	).textContent = `${newEntryText} ${actionVerb}.`
}
