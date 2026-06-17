/**
 * 株式会社Y's Air お問い合わせフォームを作成するスクリプト
 *
 * 使い方:
 * 1. https://script.google.com/ で新しいプロジェクトを作成
 * 2. このファイルの内容をすべてコピーして貼り付け
 * 3. 関数選択を「createYsAirContactForm」にして実行
 * 4. 初回はGoogleアカウントの権限承認を求められるので許可する
 * 5. 実行ログ（表示 > 実行ログ）にフォームURL・回答用スプレッドシートURLが出力される
 * 6. 「フォーム公開URL」を js/site-config.js の googleFormUrl に設定する
 *
 * 一度実行すると新しいフォームとスプレッドシートが作成されます。
 * 作り直したい場合は、再実行すると別の新しいフォームが作成されます
 * （古いものはGoogleドライブから手動で削除してください）。
 */
function createYsAirContactForm() {
  // ===== フォーム本体 =====
  const form = FormApp.create("株式会社Y's Air お問い合わせフォーム");

  form.setDescription(
    "空調メンテナンス、中古品販売・買取、協力店募集に関するお問い合わせは、" +
    "こちらのフォームよりご連絡ください。\n" +
    "内容を確認のうえ、担当者よりご連絡いたします。"
  );

  form.setCollectEmail(false);
  form.setConfirmationMessage(
    "お問い合わせいただき、ありがとうございました。\n内容を確認のうえ、担当者よりご連絡いたします。"
  );

  // ===== 1ページ目: お問い合わせ種別 =====
  const typeItem = form
    .addMultipleChoiceItem()
    .setTitle("お問い合わせ種別")
    .setRequired(true);

  // ===== 2ページ目: 協力店募集について（協力店募集を選んだ場合のみ表示・任意項目） =====
  const pagePartner = form
    .addPageBreakItem()
    .setTitle("協力店募集について")
    .setHelpText("わかる範囲でご記入ください（すべて任意項目です）。");

  form.addTextItem().setTitle("対応可能エリア").setRequired(false);

  form.addParagraphTextItem().setTitle("対応可能業務").setRequired(false);

  const entityTypeItem = form
    .addMultipleChoiceItem()
    .setTitle("法人・個人事業主の別")
    .setRequired(false);
  entityTypeItem.setChoices([
    entityTypeItem.createChoice("法人"),
    entityTypeItem.createChoice("個人事業主"),
    entityTypeItem.createChoice("その他"),
  ]);

  form.addParagraphTextItem().setTitle("保有資格・許認可").setRequired(false);

  form.addTextItem().setTitle("HP・SNS・会社URL").setRequired(false);

  // ===== 3ページ目: お問い合わせ内容（共通の必須項目） =====
  const pageCommon = form
    .addPageBreakItem()
    .setTitle("お問い合わせ内容")
    .setHelpText("以下の項目をご入力のうえ送信してください。");

  form.addTextItem().setTitle("お名前").setRequired(true);

  form.addTextItem().setTitle("会社名・屋号").setRequired(true);

  form
    .addTextItem()
    .setTitle("メールアドレス")
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation().requireTextIsEmail().build()
    );

  form.addTextItem().setTitle("電話番号").setRequired(true);

  form.addParagraphTextItem().setTitle("お問い合わせ内容").setRequired(true);

  const agreeItem = form
    .addCheckboxItem()
    .setTitle("個人情報の取り扱いへの同意")
    .setHelpText(
      "送信いただいた個人情報は、プライバシーポリシーに基づき、" +
      "お問い合わせへの対応のみに利用します。"
    )
    .setRequired(true);
  agreeItem.setChoices([
    agreeItem.createChoice("プライバシーポリシーに同意のうえ、送信します"),
  ]);

  // ===== ページ分岐の設定 =====
  // 「協力店募集について」を選んだ場合は協力店向けページへ、それ以外は共通ページへ
  typeItem.setChoices([
    typeItem.createChoice("空調メンテナンスについて", pageCommon),
    typeItem.createChoice("中古品販売について", pageCommon),
    typeItem.createChoice("中古品買取について", pageCommon),
    typeItem.createChoice("協力店募集について", pagePartner),
    typeItem.createChoice("その他", pageCommon),
  ]);

  // 協力店向けページの入力後は共通ページへ進む
  pagePartner.setGoToPage(pageCommon);

  // ===== 回答の保存先（Googleスプレッドシート） =====
  const ss = SpreadsheetApp.create("株式会社Y's Air お問い合わせフォーム（回答）");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // ===== 実行結果の確認用ログ =====
  Logger.log("フォーム編集用URL: " + form.getEditUrl());
  Logger.log("フォーム公開用URL（サイトに設定する方）: " + form.getPublishedUrl());
  Logger.log("回答スプレッドシートURL: " + ss.getUrl());
}
