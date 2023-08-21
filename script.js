const studentForm = document.getElementById("studentForm");
const studentsContainer = document.querySelector(".students");
const nameInput = studentForm['name'];
const rollInput = studentForm['roll'];


const students = JSON.parse(localStorage.getItem("students")) || [];

const addStudent = (name,roll) => {
  students.push({
    name,
    roll
  });

  localStorage.setItem("students", JSON.stringify(students));

  return { name, roll };
};

const createStudentElement = ({name,roll}) =>{
  const studentDiv = document.createElement('tr');
  const studentName = document.createElement('td');
  const studentRoll = document.createElement('td');
  const actionColumn = document.createElement('td');
  const attendColumn = document.createElement('td');
  
  studentName.innerText = name;
  studentRoll.innerText = roll;
  
  studentDiv.append(studentName, studentRoll, actionColumn, attendColumn);
  studentsContainer.appendChild(studentDiv);

  var editButton = document.createElement('button');
    editButton.innerText = "Edit";

    editButton.addEventListener('click', function(){
        var updatedName = prompt('Edit name:', name);
        var updatedage = prompt('Edit sem:', roll);

        if(updatedName !== null && 
            updatedage !== null){
                studentName.innerText = updatedName;
                studentRoll.innerText = updatedage;
        }
    });

    var deleteButton = document.createElement('button');
    deleteButton.innerText = "delete";
    deleteButton.addEventListener('click', function(){
      studentsContainer.removeChild(studentDiv);
    });
    actionColumn.append(editButton, deleteButton);

    var presentButton = document.createElement('button');
    presentButton.innerText = "P";
    presentButton.addEventListener('click', function(){
      presentButton.innerHTML = "Present";
      presentButton.style.border = "none";
      presentButton.style.background = "green";
      presentButton.style.color = "#fff";
      presentButton.style.borderRadius = 10 + "px";
      presentButton.style.padding = 5 + "px";
      absentButton.disabled = true;
      absentButton.remove();
    });

    var absentButton = document.createElement('button');
    absentButton.innerText = "A";
    absentButton.addEventListener('click', function(){
      absentButton.innerHTML = "Absent";
      absentButton.style.border = "none";
      absentButton.style.background = "red";
      absentButton.style.color = "#fff";
      absentButton.style.borderRadius = 10 + "px";
      absentButton.style.padding = 5 + "px";
      presentButton.disabled = true;
      presentButton.remove();
    });

    attendColumn.append(presentButton, absentButton);

  return studentDiv;
};

students.forEach(createStudentElement);

studentForm.onsubmit = (e) =>{
  e.preventDefault();
  const newStudent = addStudent(
    nameInput.value,
    rollInput.value
  );
  createStudentElement(newStudent)

  nameInput.value = "";
  rollInput.value = "";
};