{
  // DP=structure/3composite npm start

  /**
   * 복합객체: 또 다른 객체를 포함하는 객체
   * 
   * 복합체 패턴:
   *  복합객체간의 구조화를 통해 객체를 확장하는 패턴 ~ 트리(계층)구조를 띔
   * 
   * 마찬가지로, 느슨한 결합을 위해 의존체 주입 방식을 활용한다.
   * 
   * 구조:
   *   트리구조이기에 하위 객체가 복합객체일 수 있으며, 재귀적 호출이 가능함
   *   Root : 시작점 / Node -> Composite : 중간노드 / Leaf : 끝노드
   *  
   *   중간노드(Composite)와 끝노드(Leaf)는 다른 객체이지만, 동일하게 취급
   *    Component: 하위노드를 통일시키는 공통 인터페이스 ~ 두 객체의 공통 기능 모두 포함
   *    Component에 정의된 공통 메서드만 호출함으로써, 두 객체를 구분하지 않고 동일하게 접근해 활용 -> 투명성
   *  
   *   ~ Component는 투명성을 보장하기 위해, 두 객체의 기능을 모두 포함할 수 있음.. 단일객체 단일책임의 원칙 위배.. but 투명성 보장!
   * 
   *   현재 객체가
   *    Leaf(끝노드)인 경우, 직접 행동을 수행
   *    Composite(중간노드)인 경우, 자식 객체로 요청
   * 
   *  cf) 
   *   투명성: 객체를 서로 구별하지 않고 동일한 동작으로 처리함
   *   일반화 작업: 서로 다른 두 객체를 동일한 형태로, 투명하게 사용하기 위해 공통된 추상클래스를 상속시키거나 인터페이스를 적용하는 작업
   * 
   * 설계시 고민거리:
   *  트리구조에서 포인터를 어떻게 관리할 것인가..
   *  하위 객체 배열로 저장시, 순서는 어떻게 할 것인가..
   *  트리구조가 방대해질 때, 빠른 동작을 위한 캐싱처리는 어떻게 할 것인가..
   * 
   * 배열로 하위 객체 저장시, 순회를 통해 자식 노드 접근 ~ 반복자 패턴
   *  -> 복합체 패턴은 복합체 기능역할(책임 기능)과 반복자 기능(찾는) 2가지로 구성된다.
   *  
   * 적용사례: 파일시스템 | 카테고리 및 메뉴 구조 | 회원 구조 ..
   */

  // 복합체 패턴으로 파일시스템 구조 구현
  // composite과 leaf를 규정할 인터페이스 -> 투명화!
  // ~ 구분없이 처리하면서 오류 최소화!
  abstract class Component {
    private name: string;
    private type: string;
    private auth: string;

    getName() {
      return this.name;
    }
    setName(name: string) {
      this.name = name;
    }

    getType() {
      return this.type;
    }
    setType(type: string) {
      this.type = type;
    }

    getAuth() {
      return this.auth;
    }
    setAuth(auth: string) {
      this.auth = auth;
    }
  }

  // leaf
  class FileLeaf extends Component {
    private data: any;
    constructor(name: string, auth: string) {
      super();
      this.setName(name)
      this.setAuth(auth)
      this.setType('FILE')
    }
  
    getData() {
      return this.data;
    }
    setData(data: string) {
      this.data = data;
    }
  }

  // leaf
  class DirectoryComposite extends Component {
    // 파일 또는 디렉토리 인스턴스들을 담기위한 저장소
    private children: any[] = [];
    constructor(name: string, auth: string) {
      super();
      this.setName(name)
      this.setAuth(auth)
      this.setType('DIRECTORY')
    }
  
    addSubNode(instance: any) {
      console.log(`파일|객체 추가 완료 : ${instance.name}`);
      this.children.push(instance);
    }
    removeSubNode(instanceName: string) {
      console.log(`파일|객체 제거 완료 : ${instanceName}`);
      const index = this.children.indexOf( (obj: any) => obj.name === instanceName );
      this.children.splice(index, 1);
    }
    hasSubNode(instanceName: string) {
      const index = this.children.indexOf( (obj: any) => obj.name === instanceName );
      if ( index === -1 ) {
        return 'Not Exist';
      }
      return this.children[index].name;
    }
    ls(option: string) {
      this.children.forEach( (obj: any) => {
        let result = obj.name;
        if (option.includes('T')) {
          result += ` ${obj.type}`;
        }
        if (option.includes('A')) {
          result += ` ${obj.auth}`;
        }
        console.log(result);
      })
    }
    // 하위노드를 전부 탐색하는 재귀 서치
    lsDeep(option: string, obj = this) {
      let result =obj.getName();
      if (option.includes('T')) {
        result += ` ${obj.getType()}`;
      }
      if (option.includes('A')) {
        result += ` ${obj.getAuth()}`;
      }
      console.log(result);
      if (obj.getType() === 'DIRECTORY') {
        for (let i = 0; i < obj.children.length; i++) {
          this.lsDeep(option, obj.children[i]);
        }
      }
    }
  }
  
  // 폴더 생성
  const root = new DirectoryComposite('root', 'root');
  const home = new DirectoryComposite('home', 'root');
  const temp = new DirectoryComposite('temp', 'root');
  const falcon = new DirectoryComposite('falcon', 'User');
  const falconNodeModules = new DirectoryComposite('node_modules', 'User');
  const swallow = new DirectoryComposite('swallow', 'User');
  const secret = new DirectoryComposite('secret', 'root');

  // 파일 생성
  const indexForFalcon = new FileLeaf('index.js', 'User');
  const indexForSwallow = new FileLeaf('index.js', 'User');
  const secretKey = new FileLeaf('falcon.pem', 'root');
  const aModule = new FileLeaf('aModule.js', 'User');

  // 트리 구조화
  root.addSubNode(home)
  root.addSubNode(temp)
  home.addSubNode(falcon)
  home.addSubNode(swallow)
  home.addSubNode(secret)
  falcon.addSubNode(falconNodeModules)
  falcon.addSubNode(indexForFalcon)
  falconNodeModules.addSubNode(aModule)
  swallow.addSubNode(indexForSwallow)
  secret.addSubNode(secretKey)

  // 체크
  console.log('\nls from root with option A')
  root.ls('A');
  console.log('\nls from falcon with option T')
  falcon.ls('T');
  console.log('\nlsDeep from root with option AT')
  root.lsDeep('AT');
  
}
