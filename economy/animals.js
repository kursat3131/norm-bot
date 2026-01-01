export const animals = {
  common: [
    { name: '🐶 Köpek', value: 10, rank: 'Yaygın' },
    { name: '🐱 Kedi', value: 15, rank: 'Yaygın' },
    { name: '🐭 Fare', value: 5, rank: 'Yaygın' },
    { name: '🐹 Hamster', value: 8, rank: 'Yaygın' },
    { name: '🐰 Tavşan', value: 12, rank: 'Yaygın' },
    { name: '🦊 Tilki', value: 20, rank: 'Yaygın' }
  ],
  uncommon: [
    { name: '🐻 Ayı', value: 50, rank: 'Nadir' },
    { name: '🐼 Panda', value: 60, rank: 'Nadir' },
    { name: '🦁 Aslan', value: 80, rank: 'Nadir' },
    { name: '🐯 Kaplan', value: 90, rank: 'Nadir' },
    { name: '🦒 Zürafa', value: 70, rank: 'Nadir' }
  ],
  rare: [
    { name: '🦄 Unicorn', value: 200, rank: 'Efsanevi' },
    { name: '🐉 Ejderha', value: 500, rank: 'Efsanevi' },
    { name: '🦅 Kartal', value: 150, rank: 'Efsanevi' },
    { name: '🦋 Kelebek', value: 100, rank: 'Efsanevi' }
  ],
  legendary: [
    { name: '👑 Altın Aslan', value: 1000, rank: 'Mitolojik' },
    { name: '💎 Kristal Kurt', value: 1500, rank: 'Mitolojik' },
    { name: '🌟 Yıldız Ejderhası', value: 2000, rank: 'Mitolojik' }
  ]
};

export function getRandomAnimal() {
  const rand = Math.random();
  let category;
  
  if (rand < 0.60) category = 'common';
  else if (rand < 0.85) category = 'uncommon';
  else if (rand < 0.97) category = 'rare';
  else category = 'legendary';
  
  const animalList = animals[category];
  return animalList[Math.floor(Math.random() * animalList.length)];
}
