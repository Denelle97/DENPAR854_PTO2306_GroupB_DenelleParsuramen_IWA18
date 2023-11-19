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
  

