// ==========================
// HABIT TRACKER
// Part 3A
// ==========================

// ---------- Local Storage ----------

let habits = JSON.parse(localStorage.getItem("habits"));

if (!habits) {
    habits = [
        {
            id: 1,
            name: "💧 Drink 5L Water",
            category: "Fitness",
            priority: "High",
            time: "08:00",
            notes: "Complete 5 liters throughout the day",
            createdAt: new Date().toLocaleDateString(),
            done: false
        },
        {
            id: 2,
            name: "🏃 Morning Walk",
            category: "Fitness",
            priority: "High",
            time: "06:30",
            notes: "Walk for 30 minutes",
            createdAt: new Date().toLocaleDateString(),
            done: false
        },
        {
            id: 3,
            name: "💻 Coding Practice",
            category: "Coding",
            priority: "High",
            time: "18:00",
            notes: "Solve at least 3 DSA problems",
            createdAt: new Date().toLocaleDateString(),
            done: false
        },
        {
            id: 4,
            name: "📚 Study 2 Hours",
            category: "Study",
            priority: "High",
            time: "17:00",
            notes: "Focus on today's topics",
            createdAt: new Date().toLocaleDateString(),
            done: false
        },
        {
            id: 5,
            name: "📖 Read 20 Pages",
            category: "Reading",
            priority: "Medium",
            time: "20:00",
            notes: "Read any self-improvement book",
            createdAt: new Date().toLocaleDateString(),
            done: false
        }
    ];

    saveHabits();
}
habits = habits.map(habit => ({
    id: habit.id || Date.now() + Math.random(),
    name: habit.name || "",
    category: habit.category || "Study",
    priority: habit.priority || "Low",
    time: habit.time || "",
    notes: habit.notes || "",
    createdAt: habit.createdAt || new Date().toLocaleDateString(),
    done: habit.done || false
}));
let completedDays = JSON.parse(localStorage.getItem("days")) || 0;
let streak = JSON.parse(localStorage.getItem("streak")) || 0;
let xp = JSON.parse(localStorage.getItem("xp")) || 0;

// ---------- Save ----------

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

// ---------- Quotes ----------

const quotes = [
    "Small habits create big results.",
    "Discipline beats motivation.",
    "Never skip twice.",
    "Consistency is the key.",
    "One day or day one."
];

// ---------- Level ----------

function getLevel() {

    if (xp < 100) return "Beginner";
    if (xp < 300) return "Explorer";
    if (xp < 600) return "Warrior";
    if (xp < 1000) return "Master";

    return "Legend";
}

// ---------- Render ----------

function renderHabits() {

    const list = document.getElementById("habitList");

    list.innerHTML = "";

    let completed = 0;

    habits.forEach((habit, index) => {

        if (habit.done) completed++;

        const li = document.createElement("li");

        li.className = habit.done ? "done" : "";

        li.innerHTML = `

        <div>

            <h3>${habit.name}</h3>

            <p>📂 ${habit.category}</p>

            <p class="${(habit.priority || "low").toLowerCase()}">
            ${habit.priority || "Low"}
            </p>

            <p>🕒 ${habit.time || "--"}</p>

            <p>📝 ${habit.notes || "No Notes"}</p>

            <small>
            📅 ${habit.createdAt}
            </small>

        </div>

        <div>

            <button onclick="toggleDone(${index})">

            ${habit.done ? "Undo" : "Done"}

            </button>

            <button onclick="editHabit(${index})">

            Edit

            </button>

            <button onclick="deleteHabit(${index})">

            Delete

            </button>

        </div>

        `;

        list.appendChild(li);

    });

    let percent = habits.length === 0
        ? 0
        : Math.round((completed / habits.length) * 100);

    document.getElementById("progress").innerText =
        `Completed : ${completed} / ${habits.length} (${percent}%)`;

    document.getElementById("progressFill").style.width =
        percent + "%";

    updateStats();
}

// ---------- Add Habit ----------

function addHabit() {
    console.log("Add button clicked");

    const input = document.getElementById("habitInput");
    const category = document.getElementById("category");
    const priority = document.getElementById("priority");
    const time = document.getElementById("habitTime");
    const notes = document.getElementById("habitNotes");

    if (input.value.trim() === "") {

        alert("Enter a habit!");
        saveHabits();
        renderHabits();

        return;
    }

    habits.push({

        id: Date.now(),

        name: input.value.trim(),

        category: category.value,

        priority: priority.value,

        time: time.value,

        notes: notes.value,

        createdAt: new Date().toLocaleDateString(),

        done: false

    });

    input.value = "";
    notes.value = "";
    time.value = "";

    saveHabits();

    renderHabits();

}
// ==========================
// Part 3B
// Edit, Delete, Done, Search
// ==========================

// ---------- Toggle Done ----------

function toggleDone(index){

    habits[index].done = !habits[index].done;

    if(habits[index].done){
        xp += 10;
    }else{
        xp = Math.max(0, xp - 10);
    }

    localStorage.setItem("xp", xp);

    saveHabits();

    renderHabits();

}

// ---------- Delete ----------

function deleteHabit(index){

    if(confirm("Delete this habit?")){

        habits.splice(index,1);

        saveHabits();

        renderHabits();

    }

}

// ---------- Edit ----------

function editHabit(index){

    let newName = prompt(
        "Edit Habit",
        habits[index].name
    );

    if(newName==null) return;

    newName = newName.trim();

    if(newName===""){

        alert("Habit cannot be empty.");

        return;

    }

    habits[index].name = newName;
    console.log(habits);

    saveHabits();

    renderHabits();

}

// ---------- Search ----------

function searchHabit(){

    let input =
    document.getElementById("searchHabit")
    .value
    .toLowerCase();

    let items =
    document.querySelectorAll("#habitList li");

    items.forEach(item=>{

        item.style.display =
        item.innerText
        .toLowerCase()
        .includes(input)
        ? "flex"
        : "none";

    });

}

// ---------- Filter ----------

function filterHabits(type){

    let items =
    document.querySelectorAll("#habitList li");

    items.forEach((item,index)=>{

        if(type==="all"){

            item.style.display="flex";

        }

        else if(type==="completed"){

            item.style.display =
            habits[index].done
            ? "flex"
            : "none";

        }

        else{

            item.style.display =
            !habits[index].done
            ? "flex"
            : "none";

        }

    });

}

// ---------- Reset Day ----------

function resetHabits(){

    habits.forEach(h=>{

        h.done=false;

    });

    saveHabits();

    renderHabits();

}
// ==========================
// Part 3C
// Statistics, Complete Day,
// Theme, Initialization
// ==========================

// ---------- Update Dashboard ----------

function updateStats(){

    let completed =
    habits.filter(h => h.done).length;

    let percent =
    habits.length === 0
    ? 0
    : Math.round((completed / habits.length) * 100);

    document.getElementById("totalHabits").innerText =
    habits.length;

    document.getElementById("completedHabits").innerText =
    completed;

    document.getElementById("pendingHabits").innerText =
    habits.length - completed;

    document.getElementById("completionRate").innerText =
    percent + "%";

    document.getElementById("dayStatus").innerText =
    "Days Completed : " + completedDays;

    document.getElementById("streak").innerText =
    "🔥 Streak : " + streak;

    document.getElementById("xp").innerText =
    "⭐ XP : " + xp;

    document.getElementById("level").innerText =
    "🏆 Level : " + getLevel();

}

// ---------- Complete Day ----------

function markDayComplete(){

    if(habits.length===0){

        alert("Add some habits first!");

        return;

    }

    let allDone =
    habits.every(h => h.done);

    if(!allDone){

        alert("Complete all habits first!");

        return;

    }

    completedDays++;

    streak++;

    localStorage.setItem("days", completedDays);
    localStorage.setItem("streak", streak);

    habits.forEach(h => h.done = false);

    saveHabits();

    renderHabits();

}

// ---------- Dark Mode ----------

function toggleTheme(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

    }else{

        localStorage.setItem("theme","light");

    }

}

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

}

// ---------- Daily Quote ----------

document.getElementById("quote").innerText =
quotes[Math.floor(Math.random()*quotes.length)];

// ---------- Start App ----------

renderHabits();

updateStats();