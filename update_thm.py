import json
import os
import sys

DATA_JSON_PATH = os.path.join('src', 'js', 'thm_data.json')
DATA_JS_PATH = os.path.join('src', 'js', 'thm_data.js')

def load_data():
    if not os.path.exists(DATA_JSON_PATH):
        print(f"Error: Data file not found at {DATA_JSON_PATH}")
        sys.exit(1)
    with open(DATA_JSON_PATH, 'r') as f:
        return json.load(f)

def save_data(data):
    # 1. Save JSON
    with open(DATA_JSON_PATH, 'w') as f:
        json.dump(data, f, indent=4)
    # 2. Save JS
    with open(DATA_JS_PATH, 'w') as f:
        f.write(f"// Live TryHackMe SOC data - managed by update_thm.py\nconst thmData = {json.dumps(data, indent=4)};\n")
    print("\n[+] Success: Portfolio data updated successfully!")

def print_header(title):
    print("=" * 60)
    print(f"  {title}")
    print("=" * 60)

def main_menu(data):
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print_header("TryHackMe SOC Portfolio Update Manager")
        print(f" Current Profile: {data['profile']['username']}")
        print(f" Level:           {data['profile']['level']}")
        print(f" Rank:            {data['profile']['rank']}")
        print(f" Rooms Completed: {len([r for r in data['rooms'] if r['completed']])} / {len(data['rooms'])}")
        print("-" * 60)
        print(" [1] Update Profile Stats (Level, Rank, Total Rooms, Badges)")
        print(" [2] Update SOC Skills Graph (Radar Chart values)")
        print(" [3] Manage Completed Rooms Directory (Add / Toggle Complete)")
        print(" [4] Save and Exit")
        print(" [5] Exit without saving")
        print("-" * 60)
        
        choice = input("Select an option (1-5): ").strip()
        
        if choice == '1':
            update_profile(data)
        elif choice == '2':
            update_skills(data)
        elif choice == '3':
            manage_rooms(data)
        elif choice == '4':
            save_data(data)
            input("\nPress Enter to exit...")
            break
        elif choice == '5':
            print("\nExiting without saving.")
            break
        else:
            input("Invalid selection! Press Enter to try again...")

def get_input(prompt, default_val):
    val = input(f"{prompt} [{default_val}]: ").strip()
    return val if val else default_val

def update_profile(data):
    os.system('cls' if os.name == 'nt' else 'clear')
    print_header("Update Profile Stats")
    
    prof = data['profile']
    prof['username'] = get_input("Username", prof['username'])
    
    try:
        prof['level'] = int(get_input("Level", str(prof['level'])))
    except ValueError:
        print("[-] Level must be an integer.")
        
    prof['rank'] = get_input("Rank (e.g. Top 3%)", prof['rank'])
    
    try:
        prof['totalBadges'] = int(get_input("Total Badges count", str(prof['totalBadges'])))
    except ValueError:
        print("[-] Badges must be an integer.")
        
    try:
        prof['totalRooms'] = int(get_input("Total Rooms count", str(prof['totalRooms'])))
    except ValueError:
        print("[-] Rooms count must be an integer.")
        
    input("\nProfile updated in memory. Press Enter to return to main menu...")

def update_skills(data):
    os.system('cls' if os.name == 'nt' else 'clear')
    print_header("Update SOC Skills Graph")
    
    skills = data['skills']
    keys = [
        ('networkMonitoring', 'Network Monitoring (0-100)'),
        ('siemLogAnalysis', 'SIEM & Log Analysis (0-100)'),
        ('endpointSecurity', 'Endpoint Security (0-100)'),
        ('incidentResponse', 'Incident Response (0-100)'),
        ('digitalForensics', 'Digital Forensics (0-100)'),
        ('threatIntelligence', 'Threat Intelligence (0-100)')
    ]
    
    for key, label in keys:
        while True:
            try:
                val = int(get_input(label, str(skills[key])))
                if 0 <= val <= 100:
                    skills[key] = val
                    break
                else:
                    print("[-] Please enter a value between 0 and 100.")
            except ValueError:
                print("[-] Please enter a valid integer.")
                
    input("\nSkills updated in memory. Press Enter to return to main menu...")

def manage_rooms(data):
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print_header("Manage SOC Rooms Directory")
        
        rooms = data['rooms']
        for i, room in enumerate(rooms):
            status = "[COMPLETED]" if room['completed'] else "[IN PROGRESS]"
            print(f" [{i+1}] {status:<13} {room['title']} ({room['categoryName']})")
        print("-" * 60)
        print(" [A] Add New Room")
        print(" [B] Back to main menu")
        print("-" * 60)
        
        choice = input("Select a room index to toggle completion, 'A' to add, or 'B' to back: ").strip().lower()
        
        if choice == 'b':
            break
        elif choice == 'a':
            add_new_room(data)
        else:
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(rooms):
                    rooms[idx]['completed'] = not rooms[idx]['completed']
                    print(f"\n[+] Toggled status of '{rooms[idx]['title']}' to: {'COMPLETED' if rooms[idx]['completed'] else 'IN PROGRESS'}")
                    input("Press Enter to continue...")
                else:
                    input("Invalid index! Press Enter to try again...")
            except ValueError:
                input("Invalid option! Press Enter to try again...")

def add_new_room(data):
    os.system('cls' if os.name == 'nt' else 'clear')
    print_header("Add New Completed Room")
    
    title = input("Room Title (e.g. Zeek): ").strip()
    if not title:
        print("[-] Title cannot be empty.")
        input("Press Enter to cancel...")
        return
        
    print("\nCategories:")
    print(" [1] SIEM & Logs (siem)")
    print(" [2] Network Analysis (network)")
    print(" [3] DFIR (dfir)")
    print(" [4] Threat Intel (threat-intel)")
    cat_choice = input("Select category (1-4): ").strip()
    
    cat_map = {
        '1': ('siem', 'SIEM'),
        '2': ('network', 'Network'),
        '3': ('dfir', 'DFIR'),
        '4': ('threat-intel', 'Threat Intel')
    }
    
    category, categoryName = cat_map.get(cat_choice, ('siem', 'SIEM'))
    
    try:
        xp = int(input("XP Points: ").strip() or "100")
    except ValueError:
        xp = 100
        
    description = input("Brief Description: ").strip() or "Completed TryHackMe SOC practical lab."
    room_url = input("TryHackMe Room URL: ").strip() or "https://tryhackme.com/room/" + title.lower().replace(" ", "")
    
    completed_in = input("Completed? (y/n) [y]: ").strip().lower() != 'n'
    
    new_room = {
        "id": title.lower().replace(" ", "").replace(":", ""),
        "title": title,
        "category": category,
        "categoryName": categoryName,
        "xp": xp,
        "completed": completed_in,
        "description": description,
        "url": room_url
    }
    
    data['rooms'].append(new_room)
    print(f"\n[+] Room '{title}' added successfully!")
    input("Press Enter to continue...")

if __name__ == '__main__':
    data = load_data()
    main_menu(data)
