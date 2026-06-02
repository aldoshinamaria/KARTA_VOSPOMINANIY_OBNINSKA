interface ShareStoryButtonsProps {
  title: string;
  url: string;
  text?: string;
}

export default function ShareStoryButtons({
  title,
  url,
  text,
}: ShareStoryButtonsProps) {
  const shareText = text ?? `${title} — Живая память Обнинска`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const vkUrl = `https://vk.com/share.php?url=${encodedUrl}&title=${encodedText}`;
  const tgUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    alert('Ссылка скопирована — отправьте родным и одноклассникам');
  };

  const nativeShare = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, text: shareText, url });
    } catch {
      /* cancelled */
    }
  };

  return (
    <div className="share-buttons" role="group" aria-label="Поделиться историей">
      <button type="button" className="share-buttons__btn" onClick={nativeShare}>
        Отправить другу
      </button>
      <a
        href={vkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="share-buttons__btn share-buttons__btn--vk"
      >
        VK
      </a>
      <a
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="share-buttons__btn share-buttons__btn--tg"
      >
        Telegram
      </a>
      <button type="button" className="share-buttons__btn" onClick={copyLink}>
        Скопировать ссылку
      </button>
    </div>
  );
}
