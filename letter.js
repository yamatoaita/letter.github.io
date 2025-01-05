import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push,  get, set, onChildAdded, remove, onChildRemoved } 
from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";




class SiteSystem{
    constructor(){
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); // キーを取得
            const value = localStorage.getItem(key); // 値を取得
            //console.log(`Key: ${key}, Value: ${value}`);
        }



        {//common
            this.explain = document.getElementById("explain");
            // Firebase configuration
            const firebaseConfig = {
                apiKey: "AIzaSyB9CgQmYZocsxz_VDw_cfpH_emghLeG20A",
                authDomain: "letter-7441d.firebaseapp.com",
                projectId: "letter-7441d",
                storageBucket: "letter-7441d.firebasestorage.app",
                messagingSenderId: "1003417528239",
                appId: "1:1003417528239:web:ab688f429eec24407d715a",
                databaseURL: "https://letter-7441d-default-rtdb.firebaseio.com/" 
            };

            // Initialize Firebase
            const app = initializeApp(firebaseConfig);
            this.db = getDatabase(app);
            this.cookie_dbRef =  ref(this.db, `data/cookie`);

        }
       
        
        get(this.cookie_dbRef).then((snapshot) => {//page2, letter.indexの時のデータ取り出し
           
            if (snapshot.exists()) {//パスワードが登録されていた場合
                this.passward = snapshot.val();//データを格納[DATE,"passward"]
                this.passward = JSON.parse(this.passward);

                let cookie_date = new Date(this.passward[0]); // cookie_dateを格納
                let current_date = new Date(); // 現在の時刻を取得

                // cookie_dateから現在時刻までの経過時間をミリ秒で取得
                let elapsed_time = current_date - cookie_date; 
                console.log(`elapsed time is ${elapsed_time}. current date[${current_date}]- cookie_date[${cookie_date}]`);
                // 3秒（3000ミリ秒）経過したか判定
                if (elapsed_time >= 3000) {
                    this.passward = "Nothing";
                    console.log("over 3 sec")
                } else {
                    this.passward = this.passward[1];
                    console.log(`get passward ${this.passward}`)
                }

            
            } else {//パスワードが存在しなかった場合
                this.passward = "Nothing";
                console.log("error: non available passward, in get_userdata");
            }


            if(this.passward != "Nothing"){//page2

                {//変数の宣言
                    this.id = 0;
                    this.page_index = 0;
                    this.pages = [];   
                    this.passward_dbRef =  ref(this.db, `data/${this.passward}`);
                    this.text_changed_flg = false;
                    
                }
    
                {//HTMLウェジットの取得
                    this.btn_before = document.getElementById("btn_before");
                    this.btn_finish = document.getElementById("btn_finish");
                    this.btn_next = document.getElementById("btn_next");
                    this.modal = document.getElementById("modal");
                    this.div_writting = document.getElementById("writting");
                    
            
                    this.div_sender = document.getElementById("sender");
                    this.div_page_number = document.getElementById("page_number");
                    this.btn = document.getElementById("showbtn");
        
                    
                }
    
                {//ボタンイベントの設定
                    this.div_sender.addEventListener("input",()=>{
                        this.text_changed_flg = true;
                    },{once:true});

                    this.div_writting.addEventListener("input",()=>{
                        this.text_changed_flg = true;
                        this.trim();//手紙表示において、最大文字数の調節
                    });
                    this.btn.addEventListener("click",()=>{
                        this.show();//手紙編集・確認画面の表示
                    });
    
                }
                
                get(this.passward_dbRef).then((snapshot) => {//page2, letter.indexの時のデータ取り出し
    
                    if (snapshot.exists()) {//パスワードが登録されていた場合
                        this.letters = snapshot.val();//データを格納
                        this.letters = JSON.parse(this.letters);
                        this.letters = this.letters[0][1];//なぜか[0][0]番目にはlettersが入っている。
                        console.table(this.letters);
                        console.log("=============================================")
                        this.show_letters();//保存されている手紙データを表示
                        //this.letters = []
    
                        {//手紙編集ボタンの設定
                            this.btn_before.addEventListener("click",()=>{
                                this.before_page();//前のページに戻すボタンを設定
                            });
                    
                            this.btn_next.addEventListener("click", ()=>{
                                this.next_page();//次のページに移動・または作成するボタンを設定
                            });
                        }
    
    
                    } else {//パスワードが存在しなかった場合
                        console.log("error: non available passward, in get_userdata");
                    }
                });
                
    
                
    
            }else{//page1

                try{
    
                    {//HTMLウェジットの取得
                        this.entry = document.getElementById("entry");
                        this.entrybtn = document.getElementById("entrybtn");
                        this.registerbtn = document.getElementById("registerbtn");
                    }
                    
                    {//ボタンイベントの設定
                        this.entrybtn.addEventListener("click",()=>{
                            this.check_passward();
                        });
                        this.registerbtn.addEventListener("click",()=>{
                            this.register();
                        });
                    }
                    
                }catch(error){
                    window.location.href = "index.html";
                    //もしページがletter.htmlの時、エラーがでます。
                    //パスワードが無く、ページがletter.htmlならindex.htmlに遷移させます。
                }
                
            } 
        });
       

           


        {/*使う変数一覧
            this.id  ：　手紙の番号を司ります。各手紙HTMLウェジットのidの名前でもあります。
            this.page_index ：　ページ番号を司ります
            this.letters　：　手紙データを司ります。リスト型です。[n][0]に差出人名、[n][1]にthis.pagesのデータが入っています。
            this.pages ：　ページ内容を司ります。list型になっています。それぞれ、ページ事の文字列が記録されています。
            this.site_data　：　get_userdata(1)の時に使用する変数です。dictionary型です。passwardを入れて、データを取り出します。

        */}

        //this.register();
    }
//==============================================================================================================================================================
    trim(){//【➡constracter】手紙の表示を司ります。210半角数以上になったら記入できないようにします
        
        //全角　w15*h7
        //半角　w30*h7

        //文字列がある一定の半角数になったら、切り取ります。
        //文字列が全部全角（ひらがなや漢字など）だったら横15×縦7×2＝210 半角で切り取ります　全部全角なら105文字目で切り取ります。
        //文字列が全部半角（数字やアルファベット）だったら横30×縦7×1 =210半角で切り取ります　全角半角なら210文字目で切り取ります。

        //もし、全角と半角が混ざった文字列がある時（私の名前はaita yamato)、　210半角数になるのは、何文字目でしょうか。　105 <= ?文字目 <= 210
        //開業前です<div>改行後です</div> 
        const width = window.innerWidth;  // 画面の幅
        if(width>=480){
            var max_size = 300;
        }else{
            
            var max_size = 130;
        }
        var exit_cnt = 0;
        var exit_flg = false;
        
        if(this.div_writting.innerHTML.indexOf('<img src="http://127.0.0.1:5500/binsenn.jpg" class="binsenn" id="binsenn">') !== -1){
            this.div_writting.innerHTML = this.div_writting.innerHTML.replaceAll("<img src=\"http://127.0.0.1:5500/binsenn.jpg\" class=\"binsenn\" id=\"binsenn\">","");
        };
        if(this.div_writting.clientHeight > max_size ){
            
            var original = this.div_writting.innerHTML;
            var replaced = original.replaceAll("<br>","¶");

            var trimed = "";
            this.trim_height =  this.div_writting.clientHeight;

            while(this.trim_height > max_size && exit_flg == false){

                const last_char = replaced.charAt(replaced.length - 1);
                if(last_char == ">"){
                    var content_list = replaced.split("<div>");
                
                    if(content_list[content_list.length]=="¶</div>"){
        
                        trimed = replaced.replace(/¶$/, ""); 
                        trimed = trimed.replace("¶","<br>");
                    }else{

                        trimed = replaced.replace(/<div>(.*?)<\/div>/, '$1');
                        trimed = trimed.replace("¶","<br>");
                        this.div_writting.innerHTML = trimed;
                        if(this.div_writting.clientHeight > max_size){
                            replaced = trimed.replaceAll("<br>","¶");
                            trimed = replaced.replace(/¶$/, ""); 
                            trimed = trimed.replace("¶","<br>");
                        }

                    }

                }else{
                    var first_flg = true;
                    var target_char  = "";

                    for (let i = replaced.length-1; i >= 0; i--) {
                        target_char = replaced.charAt(i);

                        if(first_flg==true){
                            target_char = "";
                            
                            first_flg = false;
                        }
                        
                        trimed = target_char + trimed;
                    }
                }
                
                trimed = trimed.replaceAll("¶","<br>");
                this.div_writting.innerHTML = trimed;
                this.trim_height =  this.div_writting.clientHeight;

                exit_cnt += 1;
                if(exit_cnt>10){

                    exit_flg = true;
                    this.div_writting.innerHTML = this.div_writting.innerHTML.slice(0,96);
                }
            }
            
            
            this.div_writting.focus(); // 要素にフォーカスを設定
            const range = document.createRange(); // Rangeオブジェクトを作成
            const selection = window.getSelection(); // Selectionオブジェクトを取得
        
            range.selectNodeContents(this.div_writting); // 要素の内容全体を選択
            range.collapse(false); // 範囲を末尾に移動
            selection.removeAllRanges(); // 既存の選択範囲をクリア
            selection.addRange(range); // 新しい範囲を追加
        }

        


    }

    show(){//【➡constracter】手紙編集・確認画面の表示
        this.modal.style.display = "flex";

        this.btn_finish.addEventListener("click",()=>{
            this.make();

        },{once:true});
    }

    make(){//【➡show】手紙新規作成
        this.modal.style.display = "none";

        var saved_currrent_page = this.pages[this.page_index];
        if(saved_currrent_page){//既存のデータに現在のページ内容があれば
            this.pages[this.page_index] = this.div_writting.innerHTML;
        }else{//既存のページがなかった場合
            this.pages.push(this.div_writting.innerHTML);
            this.div_writting.innerHTML = "";
        }   

        //========【HTMLウェジットを製作】================================================================
        //===============================================================================================
        const parentDiv = document.querySelector('.parent');//親divウェジットを取得
        // 新しいimg要素を作成
        const img = document.createElement('img');
        // imgの属性を設定
        img.src = 'letter.png';  // 画像のソース
        img.className = "letters"; // クラス名を追加
        img.id = `letter${this.id}`;
        parentDiv.appendChild(img); // 親要素にimgを追加


        // 新しいdiv要素を作成
        const div = document.createElement('div');
        //divの属性を設定
        div.className = "contents";
        div.id = `content${this.id}`;
        //divに文字列を設定
        var raw_sender = this.div_sender.textContent;
        raw_sender = raw_sender.replaceAll("より","");
        div.textContent = `${raw_sender}さんから手紙が届いています`
        parentDiv.appendChild(div);// 親要素にdivを追加        
        
        //========【ボタンイベントの設定】================================================================
        //===============================================================================================

        const lists = [raw_sender,this.pages]

        const current_id = this.id;//ボタンイベントに保存するid番号を作成
        div.addEventListener("click",()=>{
            this.check_letter(lists,current_id);
            //手紙に関するデータを送信
        });
        img.addEventListener("click",()=>{
            this.check_letter(listsurrent_id);
            //手紙に関するデータを送信
        });
        //===============================================================================================
        //===============================================================================================        

        this.letters.push(lists);//手紙データを保存
        this.pages = []; 

        this.id += 1;
        this.save_data();//データを保存
    }

    register(){//【➡constracter】
        alert("in register")
        var register_passwards = [
            "ミセス522", "ほるん000", "りか123", "モンハン379", "ぶんがく445", "そふと291", 
            "バンド278", "ジャグリング496", "がっしょう307", "いぶんか242", "ほしぞら00", "きつね409", 
            "ケーキ376", "ゴシック721", "りす632", "とうほう534", "すたば923", "めめ216", 
            "ポチャッコ229", "にじさんじ234", "バスケ876", "やきゅう932", "くるま897", "サバゲー734", 
            "あおもり856", "ねこ2525", "やきゅう142", "やきゅう574", "ケプラー777", "レゴ306", 
            "さくら763", "ほやぼーや999", "テイラー649", "あいす449", "しろねこ453", "くじら940", 
            "ぷりん354", "ねこ67", "まっちゃ098", "つぶがい56", "りょこう937", "みずほ242", 
            "やきゅう000", "がっしょう53", "えいが888", "ドラマ354", "けいと577", "みかん452", 
            "りんご21", "ゆず756", "いちご437", "チョコ259", "ぶどう299", "ルックバック24", 
            "きゅうひ741", "てれび738", "ギター978", "どらやき418", "おしるこ663", 
            "もなか190", "ゆべし788", "まんじゅう382", "こんぺいとう398", "おやき988", "おもち864", 
            "ぜんざい485", "あんみつ843", "おはぎ315", "だんご540", "ようかん895", "せんべい859", 
            "ういろう599", "かすてら408", "ディズニー491", "わたあめ893", "エジプト876", "わんこ496", 
            "ジョジョ753", "くま436", "くまのプーさん342", "カービィ274", "さつまいも634", "コーラ134", 
            "シロフォン943", "雀魂728", "サックス126", "ディズニー274", "ひまわり513","しばいぬ463"
        ]

           
        var contents = [
            "2025年、あけましておめでとうございます。この度は、年賀状をご覧になっていただきありがとうございます。<div>この年賀状は大学で集まった5人で制作しました。こちらの手紙は年賀</div>",
            "状の制作秘話を混じえて、各コーナーの解説をします。<div><br></div><div>⑴年賀状 トップページ</div><div>デザイン:すとう はるか&nbsp;</div><div>プログラミング: ひらつか れん&nbsp;</div>",
            "<div>すとうが蛇のキャラクターを頑張って作りました。<br>⑵占いの館&nbsp;&nbsp;</div><div>デザイン: すとう,&nbsp; あいた</div><div>文案：あおの　ゆうと, あいた</div><div>プログラミング: あいた やまと</div>",
            "やまとの思い入れがある作品です。年賀状ではありますが、一年中楽しむことができます。 「仕事」「人間関係」の占いはもうお済みですか？こちらは私自身の為に作ったものでもあります。私の愛読書 『貞観",
            "政要』を原典として、来年度、社会人になる上で 為になる古語を揃えております。 2000年前もの、不易の教えです。また、「うさちゃん」2035年(兎年)の今日占いもオススメです。ぜひ、お楽しみください。",
            "⑶ヘビクイズ<div>問題制作: あおの ゆうと</div><div>デザイン:すとう はるか</div><div>プログラミング: あいた やまと</div><div><br></div><div>面白いクイズ作りに定評のある</div>",
            "あおのの制作したクイズです。問題文に合わせて、すとうが可愛い絵を描きました。ぜひ、満点を目指してみてください。",            
            "⑷おみくじ<br>デザイン:すとうはるか<div>プログラミング:あいたやまと</div><div></div><div>2025年の運勢はどうでしょうか？　ぜひすとうの可愛いイラストも合わせてご覧下さい。</div>",
            "⑸図書館コーナー<div>デザイン : みつづか まゆ</div><div>プログラミング:ひらつか れん</div><div>資料・文章: みつづか まゆ</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; あおの ゆうと</div><div><br></div>",
            "様々なヘビにまつわるお話、情報を集めました。みつづかの作ったイラストも合わせてご覧下さい。(画像はフリー素材です)。<div>ひらつかの書いた小説もぜひお読みください</div>",
            "「ひらつかより」<div>ゼロからプログラミングで悪戦苦闘して作り上げたものです。小説にコーナーにあるものは、私が久しぶりに書いた小説なので思い入れも強いです。英語で書かれていますが、</div>",         
            "内容も面白いのでぜひ読んでみてください。",
            "⑹手紙コーナー<div>デザイン:あいた やまと</div><div>プログラミング:あいた やまと</div><div><br></div><div>日頃、伝えられない感謝の言葉があります。このような交流の場があ</div>",
            "れば、嬉しいなと思い制作しました。 こちら、書き込みも可能です。 交流の場として活用ください。",
            "終わりに<div>12月〜1月にかけて、5人の力を合わせ完成しました。<div>新年、この年賀状が皆様の笑顔・喜びに繋がれば幸いです。<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 　　　制作チーム一同</div></div></div>"
        ]
        var letter = [["年賀状制作チーム",contents]]
 
        
        var obj = {
            letters : letter
        }

        var JSON_datapack =  JSON.stringify(Object.entries(obj))

        for(let item of register_passwards){
            const dbRef =  ref(this.db, `data/${item}`);
            set(dbRef,JSON_datapack);//Google Firebaseにデータを保存（key, data）
        }
        //const newPostRef = push(this.dbRef);//ユニークキーを生成する場合





    }

    next_page(){//【➡constracter】
        /*
        site_data = {passward:data}
        data = [letter1, letter2, ・・・・,]
        data[0] = letter1 = [page1, page2,　・・・・,]
        page1 = "手紙の文章が保存されていますinnerhtmlですね"

        */

        var now_page_content = this.div_writting.innerHTML;//現在のページ内容を取得
        var next_page_content = this.pages[this.page_index+1];//次のページ内容を取得
        if(next_page_content){//次のページが既存である場合
            
            this.div_writting.innerHTML = next_page_content;//次のページデータを画面に表示
        }else{//次のページがない場合
            this.pages[this.page_index] = now_page_content;//現在のページデータを保存
            this.div_writting.innerHTML = "";
        }
   
        this.page_index += 1;//ページ番号を増加
        this.div_page_number.textContent = `${this.page_index+1}枚目`;//そして、ページの枚目を表示する

    }

    before_page(){//【➡constracter】
        this.pages[this.page_index] = this.div_writting.innerHTML;//現在のページ内容を上書き保存

        this.page_index -= 1;//ページ番号を一つ減らす
        if(this.page_index < 0){
            this.page_index = 0;//ページ番号がマイナスになったら０に正す
        }

        this.div_writting.innerHTML = this.pages[this.page_index]; //ページの表示を更新する
        this.div_page_number.textContent = `${this.page_index+1}枚目`;//ページ枚目表示を更新する
    }
    

//================================================================================================================================================================

    

    check_passward(){//【➡constracter】手順　Page1-➁
        
        var user_input = this.entry.value;
        const dbRef =  ref(this.db, `data/${user_input}`);
        if(user_input == ""){
            this.explain.textContent = "パスワードが違います。もう一度入力してください"
        }else{
            get(dbRef).then((snapshot) => {
                if (snapshot.exists()) {//パスワードが登録されていた場合
                    this.link(); 
                } else {//パスワードが存在しなかった場合
                    this.explain.textContent ="パスワードが違います。もう一度入力してください"
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    get_userdata(){//モデル関数　読み込みはしない。
        get(this.passward_dbRef).then((snapshot) => {
            if (snapshot.exists()) {//パスワードが登録されていた場合
                    this.letters = snapshot.val();//データを格納
            
            } else {//パスワードが存在しなかった場合
                console.log("error: non available passward, in get_userdata");
            }
        });
    }
    
    show_letters(){//Page2-手順➂ 保存されている手紙を表示する
        console.table(this.letters);
        console.log(this.letters[0]);
        for(let item of this.letters){//item[0]:差出人名, item[1]:手紙の配列=[page1,page2,・・・, pageN], pageN=ページの内容；文字列データ
            
            //========【HTMLウェジットを製作】================================================================
            //===============================================================================================
            const parentDiv = document.querySelector('.parent');//親divウェジットを取得
            // 新しいimg要素を作成
            const img = document.createElement('img');
            // imgの属性を設定
            img.src = 'letter.png';  // 画像のソース
            img.className = "letters"; // クラス名を追加
            img.id = `letter${this.id}`;
            parentDiv.appendChild(img); // 親要素にimgを追加


            // 新しいdiv要素を作成
            const div = document.createElement('div');
            //divの属性を設定
            div.className = "contents";
            div.id = `content${this.id}`;
            //divに文字列を設定
            div.textContent = `${item[0]}さんから手紙が届いています`
            parentDiv.appendChild(div);// 親要素にdivを追加

            //========【ボタンイベントの登録】=================================================================
            //===============================================================================================
            const current_id = this.id;//ボタンイベントに保存するid番号を作成
            div.addEventListener("click",()=>{
                this.check_letter(this.letters[current_id],current_id);
                //手紙に関するデータを送信
            });
            img.addEventListener("click",()=>{
                this.check_letter(this.letters[current_id],current_id);
                //手紙に関するデータを送信
            });
            //===============================================================================================
            
            this.id += 1;//idを増加
        }
           
    }

    link(){//手順 Page1-➃　letter.htmlに遷移させます
        var user_data = this.entry.value;

        const expires = new Date();
        expires.setTime(expires.getTime() + 2000);//2000
        /*document.cookie = `passward = ${user_data};path=/; expires=${expires.toUTCString()}`;*/

        var cookie_list = [expires,user_data];
        cookie_list = JSON.stringify(cookie_list);
        set(this.cookie_dbRef,cookie_list);

        window.location.href = "letter.html";
    }


//============================================================================================================================================================

    check_letter(item,curretn_id){//【➡show_letters】保存されていた手紙を確認・編集
        this.page_index = 0;//ページ番号を初期化

        const sender = item[0] + "より";//差出人の取得
        this.div_sender.innerHTML = sender;//そして、画面に表示

        this.pages= item[1];//ページ内容の取得　リスト型
        this.div_writting.innerHTML = this.pages[this.page_index];//１ページ目を表示
        this.div_page_number.innerHTML = `${this.page_index + 1}枚目`;//現在のページ数を表示
        
        this.btn_finish.addEventListener("click",()=>{//閉じるボタンイベントを設定
            this.close(curretn_id);

        },{once:true});

        this.modal.style.display = "flex";//手紙確認・編集画面を表示
    };

    close(current_id){//【➡check_letter】手紙確認・編集画面を閉じる
        this.modal.style.display = "none";

        if(this.text_changed_flg == true){
            var rawtexts  = this.div_sender.textContent;//差出人を取得
            var replaced = rawtexts.replaceAll("より","");//より　を消去
            
        
            this.letters[current_id][0] =replaced ;//元の手紙データ　差出人データを上書き
            var current_div = document.getElementById(`content${current_id}`);
            current_div.textContent =`${replaced}さんから手紙が届いています`
        
            //===================================================================================================================
            var saved_currrent_page = this.pages[this.page_index];//現在のページにある　元データを取得
            if(saved_currrent_page){//何か元々データがある時
                this.pages[this.page_index] = this.div_writting.innerHTML;//現在のページデータをthis.pagesに上書き
            }else{//そのページ番号にデータが存在しなかった場合；そのページが存在しなかった場合
                this.pages.push(this.div_writting.innerHTML);//新たにページデータを追加
                this.div_writting.innerHTML = "";
            }
            this.letters[current_id][1] = this.pages;//元の手紙データに　ページ内容を上書き
            //===================================================================================================================

            this.save_data();//データを保存
        }

        {//各種初期化
            this.div_writting.innerHTML = "　　　ここに内容を入力";//modalの現在表示されている内容を初期化
            this.div_sender.textContent = "より";//modalの現在表示されている内容を初期化
            this.pages = [];
            this.page_index = 0;
            this.div_page_number.textContent = `${this.page_index+1}枚目`    
        }
    }

    save_data(){
        
        const user_data_pack = {};
        user_data_pack.letters = this.letters;
        const JSON_datapack =  JSON.stringify(Object.entries(user_data_pack))

        //const newPostRef = push(this.dbRef);//ユニークキーを生成する場合
        const dbRef =  ref(this.db, `data/${this.passward}`);
        set(dbRef,JSON_datapack);//Google Firebaseにデータを保存（key, data）
        
        
    }

    //=============================================================================================================

}

var system =  new SiteSystem();