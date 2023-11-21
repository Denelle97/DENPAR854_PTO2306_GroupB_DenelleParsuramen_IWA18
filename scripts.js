/// Importing necessary functions and objects from view.js and data.js
import {
    html,
    createOrderHtml,
    moveToColumn,
    updateDraggingHtml,
  } from "./view.js";
  import { COLUMNS, createOrderData, state, updateDragging } from "./data.js";
  
  // Variable to store the current order ID
  let orderID = "";
  
  // Initializing the app with focus on the add button
  focus();
  

/////////////////  HELP HANDLERS //////////////////////

// Functionality for the help toggle handler
const handleHelpToggle = (event) => {
    // Checking if the event target is the help button or close button
    const isHelpButton = event.target === html.other.help;
    const isCloseButton = event.target === html.help.cancel;
    const helpOverlay = html.help.overlay;
    
    // Showing/hiding the help overlay based on the conditions
    if (isHelpButton) {
      helpOverlay.show();
    } else if (isCloseButton) {
      helpOverlay.close();
      focus(); // Focusing on the relevant element when closing the overlay
    }
  };
  

//////////////// ADD HANDLERS //////////////////////


// Functionality for the add order handler
const handleAddToggle = (event) => {
    const isAddButton = event.target === html.other.add;
    const isCloseButton = event.target === html.add.cancel;
    const addOverlay = html.add.overlay;
    const formFields = html.add.form;
  
    if (isAddButton) {
      addOverlay.show();
    } else if (isCloseButton) {
      addOverlay.close();
      // Clearing the form input fields using .reset()
      formFields.reset();
      focus();
    }
  };
  
  // Functionality for the order submit button
  const handleAddSubmit = (event) => {
    // Preventing the page from reloading after form submission
    event.preventDefault();
    
    // Fetching the contents of the form input fields
    const title = html.add.title.value;
    const table = html.add.table.value;
    const addOverlay = html.add.overlay;
    const formFields = html.add.form;
    
    // Creating a new order object using the createOrderData function
    const newOrder = createOrderData({ title, table, column: "ordered" });
    
    // Creating HTML for the new order and appending it to the ordered column
    const newOrderHtml = createOrderHtml(newOrder);
    const orderedColumn = html.columns.ordered;
    orderedColumn.appendChild(newOrderHtml);
    
    // Resetting the form, closing the overlay, and focusing on the relevant element
    formFields.reset();
    addOverlay.close();
    focus();
  };
  

///////////////////////////////  EDIT HANDLERS //////////////////////////////
  
  // Functionality for the edit order handler
  const handleEditToggle = (event) => {
    // Checking if the clicked element is an order or the cancel button
    const isOrder = event.target.closest(".order");
    const isCancelButton = event.target === html.edit.cancel;
    const formFields = html.edit.form;
    
    // Fetching the data-id attribute from the order element
    orderID = event.target.dataset.id;
    const editOverlay = html.edit.overlay;
    
    // Showing/hiding the edit overlay based on the conditions
    if (isOrder) {
      editOverlay.show();
    } else if (isCancelButton) {
      editOverlay.close();
      formFields.reset();
      focus();
    }
  };
  
  // Functionality for the delete handler
  const handleDelete = (event) => {
    const isDeleteButton = event.target === html.edit.delete;
    const editOverlay = html.edit.overlay;
    const orderHtml = document.querySelector(`[data-id="${orderID}"]`);
    
    if (isDeleteButton) {
      // Removing the order from the DOM
      orderHtml.remove();
      editOverlay.close();
      focus();
    }
  };
  
  // Functionality for the edit submit button
  const handleEditSubmit = (event) => {
    // Preventing the default form submission behavior
    event.preventDefault();
  
    const isUpdateButton = event.target === html.edit.form;
    const editOverlay = html.edit.overlay;
  
    // Retrieving the new values from the edit form
    const newTitle = html.edit.title.value;
    const newTable = html.edit.table.value;
    const newStatus = html.edit.column.value;
    const formFields = html.edit.form;
  
    // Selecting the order div with the matching ID
    const orderHtml = document.querySelector(`[data-id="${orderID}"]`);
  
    if (isUpdateButton) {
      // Updating the text content of the order with the new values
      orderHtml.querySelector("[data-order-title]").textContent = newTitle;
      orderHtml.querySelector("[data-order-table]").textContent = newTable;
      
      // Updating the status of the order using the moveToColumn function
      moveToColumn(orderID, newStatus);
      
      // Resetting the form, closing the overlay, and focusing on the relevant element
      formFields.reset();
      editOverlay.close();
      focus();
    }
  };
  
  ////////////////////////DRAGGING HANDLERS///////////////////////

  /**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event
 */
  
  // Handler for drag over events
  const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath();
    let column = null;
  
    // Looping over the event path to find the column being dragged over
    for (const element of path) {
      const { area } = element.dataset;
      if (area) {
        column = area;
        break;
      }
    }
  
    if (!column) return;
    
    // Updating the dragging state and HTML to reflect the new column
    updateDragging({ over: column });
    updateDraggingHtml({ over: column });
  };
  
  // ID of the order being dragged
  let draggedId;
  
  // Handler for drag start events
  const handleDragStart = (event) => {
    draggedId = event.target.dataset.id;
    // Setting the data being dragged using dataTransfer.setData()
    event.dataTransfer.setData("text/plain", draggedId);
  };
  
  // Handler for drag end events
  const handleDragEnd = (event) => {
    // Retrieving the data set in the drag start handler
    const data = event.dataTransfer.getData("text/plain");
    let column = "";
  
    // Looping through the COLUMNS array to find the column with a green background
    for (const columnName of COLUMNS) {
      if (html.area[columnName].style.backgroundColor === "rgba(0, 160, 70, 0.2)")
        column = html.area[columnName]
          .querySelector('[class="grid__content"]')
          .getAttribute("data-column");
  
      // Resetting the background color of the column
      html.area[columnName].style.backgroundColor = "";
    }
  
    // Calling moveToColumn function with the draggedID and column variables
    moveToColumn(draggedId, column);
  };
  
  // Event listeners for add, edit, and help actions
  html.add.cancel.addEventListener("click", handleAddToggle);
  html.other.add.addEventListener("click", handleAddToggle);
  html.add.form.addEventListener("submit", handleAddSubmit);
  
  html.other.grid.addEventListener("click", handleEditToggle);
  html.edit.cancel.addEventListener("click", handleEditToggle);
  html.edit.form.addEventListener("submit", handleEditSubmit);
  html.edit.delete.addEventListener("click", handleDelete);
  
  html.help.cancel.addEventListener("click", handleHelpToggle);
  html.other.help.addEventListener("click", handleHelpToggle);
  
  // Event listeners for drag and drop functionality
for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener("dragstart", handleDragStart);
    htmlColumn.addEventListener("dragend", handleDragEnd);
  }
  
  for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener("dragover", handleDragOver);
  }