export default {
  name: 'şaka',
  description: 'Rastgele şaka',
  async execute(message) {
    const jokes = [
      '- Neden bilgisayar soğuk?\n- Çünkü Windows açık! 🪟',
      '- Programcı neden bahçeye gitti?\n- Çünkü bug vardı! 🐛',
      '- Neden JavaScript geliştiriciler gözlük takar?\n- Çünkü göremezler (C#)! 👓',
      '- Neden Python geliştiriciler yılan sever?\n- Çünkü Python! 🐍',
      '- Neden bilgisayar doktora gitti?\n- Virüs kaptı! 🦠',
      '- Neden programcı duşa girmedi?\n- Şampuan "Lather, Rinse, Repeat" dedi ve sonsuz döngüye girdi! 🔄',
      '- Neden Java geliştiriciler gözlük takar?\n- Çünkü C# göremezler! 😎',
      '- Neden bilgisayar müzisyen olamadı?\n- Çünkü sadece binary biliyordu! 🎵',
      '- Neden robot üzgün?\n- Çünkü rustu! 🤖',
      '- Neden bilgisayar yemek yemez?\n- Çünkü byte alır! 🍔'
    ];

    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await message.reply(joke);
  }
};
