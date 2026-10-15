# LinkScript Ecosystem (`.ls` + `.ps` + `.psx`)

Welcome to the **LinkScript Ecosystem**—a custom full-stack programming suite designed to give you the clean, elegant syntax of Python (`def`, `print`, native `f""` strings) combined with JavaScript's structural layout (`{}` braces and `()` control flow), completely bypassing the configuration nightmares and boilerplate of standard TypeScript, Node.js, and Express setups.

## 🚀 The Stack Overview

| Extension | Language Name | Role | Key Features | 
| ----- | ----- | ----- | ----- | 
| **`.ls`** | **LinkScript** | Frontend & Client Logic | Curly braces, strict/flexible typing (`int`, `float`, `long`, `string`, `bool`), and native `f""` strings. | 
| **`.ps`** | **PipeScript** | Backend & API Routes | Zero-config backend routing (`route get`), plain-English data fetching, and strict typing. | 
| **`.psx`** | **PipeScript-X** | Server-Side Templates | HTML UI component rendering tied directly to backend models and types. | 

## ✨ Killer Features

* **Native Python F-Strings Everywhere:** Write `f"Hello, {username}!"` across your entire stack without dealing with JavaScript backticks and dollar signs (`` `${username}` ``).

* **Zero Configuration:** No `tsconfig.json`, no complex Webpack/Babel pipelines, and no massive boilerplate. Just write code and run it.

* **Hybrid Typing System:**

  * Leave variables untyped (`score = 42`) for flexible, Python-style dynamic typing.

  * Apply explicit types (`int score = 42` or `const string key = "abc"`) to enforce strict runtime/compile-time safety.

  * True constants: `const` values will strictly throw a `TypeError` if modification is attempted.

* **Braces Over Whitespace:** Freedom from Python's strict indentation rules. Format your code however you like inside `{}` blocks.

## 📂 Project Structure

```
my-linkscript-app/
├── server.ps          # Backend routes and models
├── app.ls             # Client-side scripts and interactive logic
├── views/
│   └── profile.psx    # Server-rendered HTML components
└── README.md

```

## 💻 Quick Code Preview

### 1. LinkScript (`app.ls`)

```
score = 100
string player_name = "VibeCoder"
const int max_retries = 3

def calculate_score(bonus) {
    print(f"Calculating for {player_name}...")
    return score + bonus
}

while (max_retries > 0) {
    if (score > 50) {
        print(f"Player {player_name} is active!")
    }
    max_retries = max_retries - 1
}

```

### 2. PipeScript (`server.ps`)

```
model User {
    id: int,
    username: string,
    is_active: bool
}

route get "/api/users/:id" {
    take id as int
    print(f"Fetching user record ID: {id}")
    
    set current_user = fetch User where id == id
    
    if (current_user is missing) {
        reply status 404 with f"User {id} not found."
    }
    
    reply status 200 with {
        "status": "success",
        "data": current_user
    }
}

```

## 🛠️ Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/your-username/linkscript-ecosystem.git
   cd linkscript-ecosystem
   
   ```

2. Install dependencies (Node.js runtime compiler):

   ```
   npm install
   
   ```

3. Run your LinkScript or PipeScript files through the custom compiler engine:

   ```
   node compiler.js server.ps
   
   ```

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
