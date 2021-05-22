{
  // DP=behavior/11interpreter npm start

  /**
   * 해석기 패턴:
   *  간단한 언어의 문법을 정의하고, 해당 언어로 정의된 문장을 해석해 작동하는 패턴
   * 
   *  위키: 인터프리터는 고급 언어로 작성된 원시코드 명령어들을 한번에 한 줄씩 읽어들여서 실행하는 프로그램
   *   원시 코드를 기계어로 번역하는 컴파일러와 대비
   *    인터프리터는 고급 명령어들을 한줄씩 중간 형태로 번역한 다음, 그것을 실행.
   *    이와는 대조적으로, 컴파일러는 고급 명령어들을 직접 기계어로 번역
   * 
   * 언어모델 설계: 문법을 통해 언어의 규칙성 제공 ~ 구문도표 표기법 (그림) / BNF 표기법 (문자)
   *  BNF 표기법 ~ ::== :정의  /  | :선택  /  <> :비단말 기호(예약어 표시)
   *
   * 언어모델 처리(해석): 어휘 분석 / 구문 분석
   *  어휘분석: 보통 토큰으로 문자열을 구분 ~ 쪼개진 토큰들이 정의한 언어모델(문법)과 같은지 체크 & 필요없는 정보 (공백, 엔터..) 제거
   *  구문분석: 토큰으로 구분된 어휘를 조합해 구문으로 해석 ~ 구문트리라는 자료구조를 활용함
   *  
   * 중간코드: 해석기는 해석을 위해 여러 패스 (중간단계)를 가짐
   *  가령 언어의 해석과 동작은 별개로 작동되는데, 이러한 목적을 위한 패스 횟수가 곧 해석기의 성능이 된다.
   *  보통 해석, 동작 전처리의 2번의 패스를 최소한으로 갖고 있으며, 어셈블리어는 2pass 해석기이다.
   *  그리고 이러한 패스처리를 도와주는 여러 자료구조 ~ 구문트리, 스택 ( ex 식을 읽어 후위 표기법으로 수행하는 계산기 )
   * 
   *  구문트리: 언어의 표현 구문정보를 가지는 트리형 자료구조
   *   트리를 돌면서, 문장정보를 나누고 평가순서를 재정의함
   *   인터프리터 패턴에서는 하위 노드들을 객체로 표현해, 복합체 패턴의 트리가 된다.
   *   파서: 이를 반영해서 주어진 문장을 트리구조의 중간코드로 바꿔놓는 책임을 가진 클래스
   * 
   *  인터프리터: 트리형식의 계층적 언어 해석을 처리하는 구조
   */

  // 언어모델 정의
  class MyLang {
    protected START = '{{'
    protected END = '}}'
    // 기능을 담고 있는 예약어
    protected reservedSyntax: {[key:string]: Function} = {
      HI: () => { console.log('안녕하세요~~')},
      BYE: () => { console.log('잘가세요~~')},
      NOW: () => { console.log('오늘은', new Date(), '입니다.')},
    }
  }
  // 토큰을 통해 어휘분석을 담당하는 클래스 ~ C의 strtok과 유사한 역할
  class MyLangContext extends MyLang {
    private tokenSplitter = ' ';
    private index = 0;
    private tokenizedText: string[];

    // 공백을 토큰으로 하여, 주어진 문자열을 분해 ~ 어휘분석
    constructor(text: string) {
      super();
      // 기본적인 문법에 맞게 토큰화된 어휘들을 검토한다.
      if (!text.startsWith(this.START) || !text.endsWith(this.END)) {
        throw new Error('Invalid language!');
      }
      // 불필요한 요소 제거 (공백, 행바꿈, 주석 등)
      let processedText = text.replace('{{', '')
      processedText = processedText.replace('}}', '')
      this.tokenizedText = processedText.split(this.tokenSplitter).filter(token => (!token.startsWith('//') && token.trim()) );
    }
    next() {
      if (this.index === this.tokenizedText.length) {
        return null;
      }
      return this.tokenizedText[this.index++];
    }
    hasNext() {
      return this.index < this.tokenizedText.length;
    }
  }

  class MyLangInterpreter extends MyLang {
    private tokenizer;
    private reservedWordsRegex = /<(.*?)>/;
    constructor(text: string) {
      super();
      console.log(`${text} 해석 시작\n`);
      this.tokenizer = new MyLangContext(text);
    }
    interpret() {
      let result = '';
      const { calculate: interpretNumericWord, getResult, getIsworkedRightBefore } = this.interpretNumericWord();
      while(this.tokenizer.hasNext()) {
        const token = this.tokenizer.next()!;
        // console.log(token)
        // 정의한 문법에 걸리는지?
        if ( interpretNumericWord(token) ) {
          // 1.수식처리
        } else {
          // 수식처리 한게 있으면 리턴
          if (getIsworkedRightBefore()) {
            result += result ? ` ${getResult()}` : getResult();
          }
          if ( this.interpretReservedWord(token) ) {
            // 예약기능 처리
          } else {
            // 그외는 그냥 출력
            result += result ? ` ${token}` : token;
          }
        }
      }
      console.log(result);
    }

    // 이부분이 객체가 되어야 함! 1
    interpretReservedWord(token: string) {
      const syntaxWord = this.reservedWordsRegex.exec(token);
        if (syntaxWord) {
          const reservedAction = this.reservedSyntax[syntaxWord[1]];
          if (!reservedAction) {
            throw new Error(`Invalid syntax near ${token}`);
          }
          console.log('**예약기능 작동**')
          reservedAction();
          return true;
        }
      return false;
    }

    // 이부분이 객체가 되어야 함! 2
    interpretNumericWord() {
      // 후위연산자 받아서 계산 처리
      const operandStack: number[] = [];
      let isworkedRightBefore = false;
      return {
        // 계산
        calculate: function(token: string) {
          if ( !Number.isNaN( Number(token) ) ) {
            operandStack.push(Number(token));
            isworkedRightBefore = true;
          } else if (token === '+' && operandStack.length >= 2) {
            operandStack.push(operandStack.pop()! + operandStack.pop()!);
            isworkedRightBefore = true;
          } else if (token === '-' && operandStack.length >= 2) {
            operandStack.push(operandStack.pop()! - operandStack.pop()!);
            isworkedRightBefore = true;
          } else if (token === '*' && operandStack.length >= 2) {
            operandStack.push(operandStack.pop()! * operandStack.pop()!);
            isworkedRightBefore = true;
          } else if (token === '/' && operandStack.length >= 2) {
            operandStack.push(operandStack.pop()! / operandStack.pop()!);
            isworkedRightBefore = true;
          } else {
            return false;
          }
          return true;
        },
        // 결과값 리턴 및 스택 초기화
        getResult: () => operandStack.pop(),
        // 계산 끝났는지 확인
        getIsworkedRightBefore: () => {
          if ( isworkedRightBefore ) {
            isworkedRightBefore = false;
            return true;
          }
          return false;
        },
      }
    }
  }
  // 실행
  const text = '{{ //이건테스트이다 고! <HI> 1 1 + 나머지는 기본 입력값 입니다! 3 2 * 10 + <NOW> 끝~ }}';
    // 인터프리터 내부의 상세 해석부분도 전부 객체로 되어있어야 한다!
  const interpreter = new MyLangInterpreter(text);
  interpreter.interpret();
}
