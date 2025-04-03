// Mock data for demonstration
let userData = {
    completedCourses: 0,
    totalRewards: 0,
    achievements: 0,
    walletConnected: false
};

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const completedCoursesEl = document.getElementById('completedCourses');
const totalRewardsEl = document.getElementById('totalRewards');
const achievementsEl = document.getElementById('achievements');
const claimRewardBtn = document.getElementById('claimReward');
const claimReferralBtn = document.getElementById('claimReferral');

// Initialize Petra wallet
let petraWallet = null;

// Check if Petra wallet is installed
async function checkPetraWallet() {
    if (window.petra) {
        petraWallet = window.petra;
        return true;
    }
    return false;
}

// Event Listeners
connectWalletBtn.addEventListener('click', connectWallet);
claimRewardBtn.addEventListener('click', claimReward);
claimReferralBtn.addEventListener('click', claimReferral);

// Functions
async function connectWallet() {
    try {
        const isPetraInstalled = await checkPetraWallet();
        
        if (!isPetraInstalled) {
            alert('Please install Petra wallet extension first!');
            window.open('https://petra.app/', '_blank');
            return;
        }

        // Connect to Petra wallet
        const response = await petraWallet.connect();
        
        if (response) {
            userData.walletConnected = true;
            connectWalletBtn.textContent = 'Connected';
            connectWalletBtn.disabled = true;
            connectWalletBtn.style.backgroundColor = '#27ae60';
            
            // Get wallet address
            const account = await petraWallet.account();
            console.log('Connected wallet address:', account.address);
            
            // Update UI to show connected state
            updateDashboard();
        }
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

function updateDashboard() {
    completedCoursesEl.textContent = userData.completedCourses;
    totalRewardsEl.textContent = `${userData.totalRewards} TCR`;
    achievementsEl.textContent = userData.achievements;
}

async function claimReward() {
    if (!userData.walletConnected) {
        alert('Please connect your wallet first');
        return;
    }

    try {
        // In a real implementation, this would interact with the smart contract
        // For now, we'll just simulate the reward claim
        const account = await petraWallet.account();
        
        // Here you would typically:
        // 1. Create a transaction payload
        // 2. Sign and submit the transaction
        // 3. Wait for confirmation
        
        userData.completedCourses++;
        userData.totalRewards += 10; // 10 TCR per course
        userData.achievements++;
        
        updateDashboard();
        alert('Reward claimed successfully!');
    } catch (error) {
        console.error('Error claiming reward:', error);
        alert('Failed to claim reward. Please try again.');
    }
}

async function claimReferral() {
    if (!userData.walletConnected) {
        alert('Please connect your wallet first');
        return;
    }

    try {
        const account = await petraWallet.account();
        
        // Here you would typically:
        // 1. Create a transaction payload for referral
        // 2. Sign and submit the transaction
        // 3. Wait for confirmation
        
        userData.totalRewards += 5; // 5 TCR referral bonus
        userData.achievements++;
        
        updateDashboard();
        alert('Referral bonus claimed successfully!');
    } catch (error) {
        console.error('Error claiming referral:', error);
        alert('Failed to claim referral bonus. Please try again.');
    }
}

// Check for Petra wallet on page load
document.addEventListener('DOMContentLoaded', async () => {
    const isPetraInstalled = await checkPetraWallet();
    if (!isPetraInstalled) {
        connectWalletBtn.textContent = 'Install Petra Wallet';
        connectWalletBtn.onclick = () => window.open('https://petra.app/', '_blank');
    }
    
    // Initialize dashboard
    updateDashboard();
}); 