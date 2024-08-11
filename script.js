// Grades mapping
const subjectGrades = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6,
    'E': 5,
    'F': 0
};

const gradeValues = {
    10: 'S',
    9: 'A',
    8: 'B',
    7: 'C',
    6: 'D',
    5: 'E',
    0: 'F'
};

const labGrades = {
    'S': 10,
    'A': 9,
    'B': 8,
    'C': 7,
    'D': 6
};

document.addEventListener("DOMContentLoaded", () => {
    const studentNumberInput = document.querySelector('.nof-stud');

    // Load students data from localStorage if available, otherwise start with default number
    const storedData = JSON.parse(localStorage.getItem('studentsData')) || [];
    if (storedData.length > 0) {
        studentNumberInput.value = storedData.length;  // Pre-fill the number of students
        renderStudentEntries(storedData);
    }

    // Event listener to update the student entries based on input value
    studentNumberInput.addEventListener('input', (e) => {
        const numStudents = parseInt(e.target.value);

        if (isNaN(numStudents) || numStudents <= 0) {
            alert('Please enter a valid number of students.');
            return;
        }

        // If valid input, generate the student entries
        renderStudentEntries(Array(numStudents).fill({}));
    });
});

// Render the student entries
function renderStudentEntries(studentsData) {
    const studentContainer = document.getElementById('studentContainer');
    studentContainer.innerHTML = ''; // Clear any existing entries

    studentsData.forEach((data, index) => {
        let div = document.createElement('div');
        div.className = 'student-entry';

        let label = document.createElement('label');
        label.className = "text-lg mb-2 mt-3"
        label.textContent = `Student ${index + 1}:`;
        div.appendChild(label);

        let input = document.createElement('input');
        input.type = 'text';
        input.className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300";
        input.placeholder = 'Enter student name';
        input.value = data.name || '';
        div.appendChild(input);

        // Add subject and lab dropdowns
        for (let i = 1; i <= 5; i++) {
            let select = createDropdown(subjectGrades, data[`subject${i}`]);
            select.className = "mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm py-2 mt-2";
            div.appendChild(select);
        }

        for (let i = 1; i <= 3; i++) {
            let select = createDropdown(labGrades, data[`lab${i}`]);
            select.className = "mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm py-2 mt-2";
            div.appendChild(select);
        }

        studentContainer.appendChild(div);
    });
}

// Create a dropdown with grades and set selected value if available
function createDropdown(gradeMapping, selectedValue) {
    let select = document.createElement('select');

    for (let grade in gradeMapping) {
        let option = document.createElement('option');
        option.value = gradeMapping[grade];
        option.textContent = grade;
        if (gradeMapping[grade] == selectedValue) {
            option.selected = true;
        }
        select.appendChild(option);
    }

    return select;
}

// Save student data to localStorage
function saveStudentData() {
    const studentEntries = document.getElementsByClassName('student-entry');
    const studentsData = [];

    let studentNames = new Set();

    for (let studentEntry of studentEntries) {
        let studentData = {};
        studentData.name = studentEntry.querySelector('input').value.trim();

        if (studentNames.has(studentData.name)) {
            alert(`The name "${studentData.name}" already exists. Please use a unique name.`);
            return;  // Stop saving if duplicate name is found
        }
        if (studentData.name) {
            studentNames.add(studentData.name);
        }

        let selects = studentEntry.querySelectorAll('select');
        selects.forEach((select, index) => {
            if (index < 5) {
                studentData[`subject${index + 1}`] = parseInt(select.value);
            } else {
                studentData[`lab${index - 4}`] = parseInt(select.value);
            }
        });

        studentsData.push(studentData);
    }

    localStorage.setItem('studentsData', JSON.stringify(studentsData));
}

// Calculate SGPA for a student
function calculateSGPA(grades, subjectCredits = 4, labCredits = 2) {
    let totalSubjectPoints = grades.slice(0, 5).reduce((acc, grade) => acc + (grade * subjectCredits), 0);
    let totalLabPoints = grades.slice(5).reduce((acc, grade) => acc + (grade * labCredits), 0);

    let totalPoints = totalSubjectPoints + totalLabPoints;
    let totalCredits = (subjectCredits * 5) + (labCredits * 3);

    return totalPoints / totalCredits;
}

// Generate the report and assign ranks
function generateReport() {
    saveStudentData();  // Save data to localStorage before generating the report
    const studentEntries = document.getElementsByClassName('student-entry');
    const tbody = document.querySelector('#reportTable tbody');
    tbody.innerHTML = '';

    let studentsData = [];

    for (let studentEntry of studentEntries) {
        let studentName = studentEntry.querySelector('input').value;
        let grades = Array.from(studentEntry.querySelectorAll('select')).map(select => parseInt(select.value));
        let sgpa = calculateSGPA(grades);

        studentsData.push({ name: studentName, sgpa, grades });
    }

    // Sort students by SGPA to assign ranks
    studentsData.sort((a, b) => b.sgpa - a.sgpa);

    studentsData.forEach((studentData, index) => {
        let row = document.createElement('tr');
        
        // Student Name
        row.innerHTML = `<td class="whitespace-nowrap px-4 uppercase py-2 font-medium text-gray-900">${studentData.name}</td>`;
        
        // Grades as Letter Grades
        row.innerHTML += studentData.grades.map(grade => 
            `<td class="whitespace-nowrap px-4 py-2 text-gray-700">${gradeValues[grade]}</td>`
        ).join('');
        
        // SGPA
        row.innerHTML += `<td class="whitespace-nowrap px-4 py-2 text-gray-700">${studentData.sgpa.toFixed(2)}</td>`;
        
        // Rank
        row.innerHTML += `<td class="whitespace-nowrap px-4 py-2 text-gray-700">${index + 1}</td>`;
        
        tbody.appendChild(row);
    });

    document.getElementById('reportTable').style.display = 'table';
    document.getElementById('exportButton').style.display = 'block';
}

// Add a new student entry dynamically
function addStudent() {
    const studentContainer = document.getElementById('studentContainer');
    const numberOfStudents = studentContainer.children.length;

    let div = document.createElement('div');
    div.className = 'student-entry';

    let label = document.createElement('label');
    label.textContent = `Student ${numberOfStudents + 1}:`;
    label.className = "text-lg mb-2 mt-3"
    div.appendChild(label);

    let input = document.createElement('input');
    input.type = 'text';
    input.className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300";
    input.placeholder = 'Enter student name';
    div.appendChild(input);

    // Add subject and lab dropdowns
    for (let i = 1; i <= 5; i++) {
        let select = createDropdown(subjectGrades);
        select.className = "mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm py-2 mt-2";
        div.appendChild(select);
    }

    for (let i = 1; i <= 3; i++) {
        let select = createDropdown(labGrades);
        select.className = "mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm py-2 mt-2";
        div.appendChild(select);
    }

    studentContainer.appendChild(div);
}
// Clear all stored data
function clearData() {
    if (confirm("Are you sure you want to clear all the stored data? This action cannot be undone.")) {
        localStorage.clear();
        alert("All stored data has been cleared.");
        location.reload();  // Reload the page to reflect the changes
    }
}

// Export the table to Excel
function exportToExcel() {
    let wb = XLSX.utils.table_to_book(document.getElementById('reportTable'));
    XLSX.writeFile(wb, 'SGPA_Report.xlsx');
}
