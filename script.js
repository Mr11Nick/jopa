
const gameState = {
    gold: 0,
    clickPower: 1,
    mineLevel: 1,
    oreMaxHp: 50,
    oreCurrentHp: 50,
    rankIndex: 0
};


const ranks = ["РАБ", "Крестьянин", "Церковник", "Барон", "Дворянин", "Царь", "Бог"];


const upgrades = [
    { id: 'slave', name: 'РАБ', baseCost: 15, costMultiplier: 1.15, dps: 1, count: 0, minRank: 0 },
    { id: 'peasant', name: 'Крестьянин', baseCost: 100, costMultiplier: 1.15, dps: 5, count: 0, minRank: 1 },
    { id: 'cleric', name: 'Церковник', baseCost: 500, costMultiplier: 1.15, dps: 25, count: 0, minRank: 2 },
    { id: 'baron', name: 'Барон', baseCost: 3000, costMultiplier: 1.15, dps: 150, count: 0, minRank: 3 },
    { id: 'noble', name: 'Дворянин', baseCost: 20000, costMultiplier: 1.15, dps: 1000, count: 0, minRank: 4 },
    { id: 'tsar', name: 'Царь', baseCost: 150000, costMultiplier: 1.15, dps: 8000, count: 0, minRank: 5 },
    { id: 'god', name: 'Бог', baseCost: 1000000, costMultiplier: 1.15, dps: 50000, count: 0, minRank: 6 }
];

const upgradesListContainer = document.getElementById('upgrades-list');


function createUpgradeCards() {
    upgradesListContainer.innerHTML = '';
    upgrades.forEach((upg, index) => {
        const card = document.createElement('div');
        card.className = `upgrade-card locked`;
        card.id = `card-${upg.id}`;
        card.innerHTML = `
            <div class="upgrade-info">
                <span class="upgrade-name">${upg.name} <span class="upgrade-count" id="count-${upg.id}">(0)</span></span>
                <span style="font-size: 12px; color: #bbb;">Урон: +${upg.dps}/сек</span>
                <span class="upgrade-cost" id="cost-${upg.id}">Цена: ${upg.baseCost}</span>
            </div>
            <button class="upgrade-btn" id="btn-${upg.id}">Нанять</button>
        `;
        upgradesListContainer.appendChild(card);


        document.getElementById(`btn-${upg.id}`).addEventListener('click', () => buyUpgrade(index));
    });
}

function getCurrentCost(upg) {
    return upg.baseCost * Math.pow(upg.costMultiplier, upg.count);
}

function updateUI() {
    document.getElementById('gold-display').innerText = Math.floor(gameState.gold);
    document.getElementById('click-power-display').innerText = gameState.clickPower;
    document.getElementById('mine-level-display').innerText = gameState.mineLevel;
    document.getElementById('current-rank').innerText = `Статус: ${ranks[gameState.rankIndex]}`;

    const hpBar = document.getElementById('ore-hp-bar');
    const percent = (gameState.oreCurrentHp / gameState.oreMaxHp) * 100;
    hpBar.style.width = `${percent}%`;
    hpBar.innerText = `${Math.ceil(gameState.oreCurrentHp)} / ${gameState.oreMaxHp} HP`;

    upgrades.forEach((upg) => {
        const btn = document.getElementById(`btn-${upg.id}`);
        const card = document.getElementById(`card-${upg.id}`);
        const cost = getCurrentCost(upg);

        if (gameState.rankIndex >= upg.minRank) {
            card.classList.remove('locked');
            btn.disabled = gameState.gold < cost;
        } else {
            card.classList.add('locked');
            btn.disabled = true;
        }
        
        document.getElementById(`cost-${upg.id}`).innerText = `Цена: ${Math.floor(cost)}`;
        document.getElementById(`count-${upg.id}`).innerText = `(${upg.count})`;
    });
}


function buyUpgrade(index) {
    const upg = upgrades[index];
    const cost = getCurrentCost(upg);

    if (gameState.gold >= cost && gameState.rankIndex >= upg.minRank) {
        gameState.gold -= cost;
        upg.count++;

        gameState.clickPower += Math.ceil(upg.dps * 0.1);
        
        updateUI();
    }
}


function checkRankProgression() {

    const calculatedRank = Math.floor((gameState.mineLevel - 1) / 5);
    if (calculatedRank < ranks.length && calculatedRank > gameState.rankIndex) {
        gameState.rankIndex = calculatedRank;
        alert(`Ваш статус в обществе повысился до: ${ranks[gameState.rankIndex]}`);
    }
}


function damageOre(amount) {
    gameState.oreCurrentHp -= amount;


    if (gameState.oreCurrentHp <= 0) {
        const reward = gameState.mineLevel * 15;
        gameState.gold += reward;

        gameState.mineLevel++;

        gameState.oreMaxHp = Math.floor(50 * Math.pow(1.25, gameState.mineLevel - 1));
        gameState.oreCurrentHp = gameState.oreMaxHp;

        checkRankProgression();
    }
    updateUI();
}


document.getElementById('ore-btn').addEventListener('click', () => {
    damageOre(gameState.clickPower);
});


setInterval(() => {
    let totalDps = 0;
    upgrades.forEach(upg => {
        totalDps += upg.count * upg.dps;
    });
    
    if (totalDps > 0) {
        damageOre(totalDps / 10);
    }
}, 100);


createUpgradeCards();
updateUI();
