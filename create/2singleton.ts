{
  // DP=create/2singleton npm start

  /**
   * 싱글톤 패턴
   * 한 책임을 가진 객체의 수를 하나로 제한함
   *  new 생성자로 반복 생성하지 않고, 생성을 담당하는 클래스를 통해 생성 관리.
   *  하나의 객체가 공유되어 여러 문맥에서 활용됨
   *
   * 한 책임에 대한 속성(상태값) 공유 ~ 별도로 생성된 객체는 한책임에 대해 분리된 상태값을 가짐
   * 한 책임에 대한 여러 객체가 생성되면서 필요없는 메모리 할당을 막음
   *
   * 단점:
   *  멀티 프로세스 환경에서 자원에 대한 동시요청시, 자원 복수 생성..
   *   ~ lazy init을 통해 보완 || 부팅시, 싱글턴 객체를 미리 생성
   *  어떤 프로세스에서 쓰일지 몰라, 메모리에 상주시킴
   */
  class MysqlCient {
    constructor(private host: string) {
      console.log(`${this.host}에 연결되었습니다.`);
    }
    isConnect() {
      if (!this.host) {
        console.log("연결이 유실되었습니다.");
      }
      console.log(`${this.host}에 연결중입니다.`);
    }
  }
  // 정적 클래스를 통해 싱글톤 팩토리 구현
  //  ~ 일반 클래스에 비해, 메모리 상주 & 다형성을 포기한(비동적) 클래스
  class Mysql {
    static dbInstance: any;
    constructor() {}

    static getInstance(host: string) {
      // 처음에만 생성하고, 내부 객체가 존재하면 내부 객체 리턴
      if (!Mysql.dbInstance) {
        Mysql.dbInstance = new MysqlCient(host);
      }
      return Mysql.dbInstance;
    }
  }
  const host = "aaabbbccc";
  // 여러 객체 요청에도 딱 하나의 생성된 객체만 반환함
  Mysql.getInstance(host).isConnect();
  Mysql.getInstance(host).isConnect();
  Mysql.getInstance(host).isConnect();
}
