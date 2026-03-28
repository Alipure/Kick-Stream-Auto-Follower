// SAVE THIS AS A SNIPPET IN CHROME DEVTOOLS
// Go to Sources -> Snippets -> New snippet -> Paste this -> Run

// Global state to persist across page loads
if (!window.kickAutoFollow) {
    window.kickAutoFollow = {
        channels: [
            "omizoone", "reald8sh", "ali_gaming16", "dahrooj", "foxrex",
            "k1krm", "santtosa", "ghassan_1988", "kaiji16", "7amada7asan",
            "abusaado", "tayseer-el5ateer", "spitfire57", "alntw", "3bo54",
            "engtwins24", "m1ke_1g", "iabotala", "friezy", "salem_jaza",
            "xkwerm", "fantasawy", "ezq7", "imegalo", "m7sneq", "ii_md11",
            "lsaad77", "x9mt", "kiimitzako", "morcei", "itvrz", "bl4ckts",
            "amirko", "itslmordo", "bnanh", "1bs1", "abo5oel"
        ],
        currentIndex: 0,
        successCount: 0,
        failCount: 0,
        isRunning: false,
        mode: null // 'search' or 'direct'
    };
}

const autoFollow = window.kickAutoFollow;

// Function to save state
function saveState() {
    localStorage.setItem('kickAutoFollowState', JSON.stringify({
        currentIndex: autoFollow.currentIndex,
        successCount: autoFollow.successCount,
        failCount: autoFollow.failCount,
        channels: autoFollow.channels
    }));
    console.log("💾 State saved");
}

// Function to load state
function loadState() {
    const saved = localStorage.getItem('kickAutoFollowState');
    if (saved) {
        const state = JSON.parse(saved);
        autoFollow.currentIndex = state.currentIndex;
        autoFollow.successCount = state.successCount;
        autoFollow.failCount = state.failCount;
        autoFollow.channels = state.channels;
        console.log("📂 State loaded - Resuming from index", autoFollow.currentIndex);
    }
}

// Function to follow current channel
async function followCurrentChannel() {
    console.log(`\n📌 Processing: @${autoFollow.channels[autoFollow.currentIndex]}`);
    
    // Find and click follow button
    const buttons = document.querySelectorAll('button');
    for (let btn of buttons) {
        const text = btn.textContent.trim();
        if (text === "Follow" && !btn.disabled) {
            btn.click();
            console.log(`✅ Followed @${autoFollow.channels[autoFollow.currentIndex]}`);
            autoFollow.successCount++;
            saveState();
            return true;
        } else if (text === "Following" || text === "Unfollow") {
            console.log(`→ Already following @${autoFollow.channels[autoFollow.currentIndex]}`);
            return false;
        }
    }
    
    console.log(`❌ Could not follow @${autoFollow.channels[autoFollow.currentIndex]}`);
    autoFollow.failCount++;
    saveState();
    return false;
}

// Function to go to next channel
function goToNextChannel() {
    autoFollow.currentIndex++;
    saveState();
    
    if (autoFollow.currentIndex < autoFollow.channels.length) {
        const nextChannel = autoFollow.channels[autoFollow.currentIndex];
        console.log(`\n🔄 Moving to next channel: @${nextChannel}`);
        console.log(`📊 Progress: ${autoFollow.currentIndex}/${autoFollow.channels.length}`);
        
        // Navigate to next channel
        window.location.href = `https://kick.com/${nextChannel}`;
    } else {
        console.log("\n🎉 COMPLETE!");
        console.log(`✅ Successfully followed: ${autoFollow.successCount}`);
        console.log(`❌ Failed: ${autoFollow.failCount}`);
        console.log(`📊 Total: ${autoFollow.channels.length}`);
        autoFollow.isRunning = false;
        localStorage.removeItem('kickAutoFollowState');
    }
}

// Main automation function
async function runAutoFollow() {
    if (autoFollow.isRunning) {
        console.log("⚠️ Already running!");
        return;
    }
    
    autoFollow.isRunning = true;
    loadState();
    
    // If we're on a channel page, follow it
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath.startsWith('/')) {
        const currentChannel = currentPath.substring(1);
        console.log(`📍 Current page: @${currentChannel}`);
        
        await followCurrentChannel();
        
        // Wait a moment then go to next
        console.log("⏳ Waiting 2 seconds before next...");
        setTimeout(() => {
            goToNextChannel();
        }, 2000);
    } else {
        // Start from first channel
        console.log("🚀 Starting automation...");
        goToNextChannel();
    }
}

// Function to reset and start over
function resetAndStart() {
    localStorage.removeItem('kickAutoFollowState');
    autoFollow.currentIndex = 0;
    autoFollow.successCount = 0;
    autoFollow.failCount = 0;
    autoFollow.isRunning = false;
    console.log("🔄 Reset complete. Starting fresh...");
    runAutoFollow();
}

// Auto-resume if page loads and script is running
if (autoFollow.isRunning) {
    console.log("🔄 Auto-resuming...");
    setTimeout(() => {
        runAutoFollow();
    }, 1000);
}

// Console commands
console.log("✅ Auto-follow script loaded!");
console.log("Commands:");
console.log("  runAutoFollow()  - Start/resume automation");
console.log("  resetAndStart()  - Reset and start over");
console.log("  saveState()      - Manually save state");
console.log("  autoFollow       - View current state");

// Start automatically if we're on a channel page
if (window.location.pathname !== '/') {
    console.log("📍 On channel page, starting automation...");
    setTimeout(() => {
        runAutoFollow();
    }, 1000);
}
