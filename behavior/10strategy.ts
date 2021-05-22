{
  // DP=behavior/10strategy npm start

  /**
   * 전략: 특정 목표를 달성하기 위한 전체적인 틀
   *  전술: 전략을 수행하기위한 방법론
   * 
   *  전략패턴:
   * 개발을 하며 달성하고자 하는 목표는 그대로지만,
   * 환경의 변화 / 요구의 변화 / 시간의 변화 등에 따라 세부적인 방법론은 변하기 마련..
   * 이런 방법론의 변화에 잘 대처(리팩토링) 하는 것이 곧 프로그램의 수명과도 직결된다.
   * 
   * 이렇게 분리된 처리 로직을 알고리즘이라 칭함 ~ 문제를 해결하는 하나의 패턴
   *  - 전략의 상세 내용은 특정 알고리즘 내에 캡슐화
   *  - 자연스런 알고리즘의 교체를 위해, 동일한 인터페이스를 적용 (구조 통일, 호환성)
   * 
   * -> 별도의 객체에 캡슐화된 알고리즘들을 관리 & DI를 통한 복합객체 형식으로, 유지보수가 쉬워진다!
   *   또한 이 패턴을 통해, 동적으로 알고리즘을 변경하는 이점을 누릴 수도 있음!
   */

  // 다형성을 가질 알고리즘들에 인터페이스로 호환성을 갖추게 한다.
  interface IDcEvent {
    eventType: string,
    calculatePrice(originalPrice: number, ...args: any[]): {
      originalPrice: number,
      dcPrice: number,
      eventType: string,
      [key:string]: any,
    };
  }
  // 할인을 위한 여러 이벤트로직(방법론)이 있고 이를 객체로 만들어 관리한다.
  class DeliveryEvent implements IDcEvent {
    eventType = '배달비 이벤트';
    private distanceDcMap = {
      500: [0, 3],
      1000: [3, 6],
      1500: [6, Infinity],
    };
    calculatePrice(originalPrice: number, startLat: number, startLng: number, endLat: number, endLng: number) {
      const distance = this.calculateDistance( startLat, startLng, endLat, endLng );
      // 거리에 따른 배달비 계산
      let dcAmount = 0;
      for (const [key, value] of Object.entries(this.distanceDcMap)) {
        const [from, to] = value;
        if (from <= distance && to > distance) {
          dcAmount = Number(key);
        }
      }
      return {
        originalPrice,
        dcPrice: originalPrice - dcAmount,
        eventType: this.eventType,
        distance,
      }
    }
    calculateDistance(startLat: number, startLng: number, endLat: number, endLng: number) {
      return 1;
    }
  }
  class ItemEvent implements IDcEvent {
    eventType = '상품 이벤트';
    calculatePrice(originalPrice: number, itemList: {name: string, price: number, dcAmount?: number}[]) {
      // 상품 할인 적용
      const itemDcInfo = itemList.reduce( (result, itemPriceInfo) => {
        if (itemPriceInfo.dcAmount) {
          result.dcItems.push(itemPriceInfo.name);
          result.dcPrice -= itemPriceInfo.dcAmount;
        }
        return result;
      }, {
        dcPrice: originalPrice,
        dcItems: [] as string[],
      })

      return {
        originalPrice,
        dcPrice: originalPrice - itemDcInfo.dcPrice,
        eventType: this.eventType,
        dcItems: itemDcInfo.dcItems,
      }
    }
  }
  class ConvenienceStoreEvent implements IDcEvent {
    eventType = '제휴 이벤트';
    private companyDcRate: number;
    constructor(private companyName: string, companyDcRate: number, private minPrice: number) {
     this.companyDcRate = companyDcRate < 1 ? companyDcRate : companyDcRate / 100;
    }
    calculatePrice(originalPrice: number) {
      // 회사 할인 적용
      let dcPrice = originalPrice;
      if (this.minPrice < originalPrice) {
        dcPrice -= (dcPrice * this.companyDcRate);
      }

      return {
        originalPrice,
        dcPrice,
        eventType: this.eventType,
        companyName: this.companyName,
        companyDcRate: this.companyDcRate,
      }
    }
  }

  class EventStrategy {
    constructor(private availableEvents: IDcEvent[]) {
      console.log('이 시점에 유효한 이벤트 객체 DI')
    }

    // 주입받은 이벤트 객체를 호출해 특정 방법론을 적용한다!
    calculatePrice(originalPrice: number, eventType: string, ...args: any[]) {
      const targetEvent = this.availableEvents.find( event => event.eventType === eventType ) ;
      if ( targetEvent ) {
        return targetEvent.calculatePrice(originalPrice, ...args);
      }
    }
  }

  // 실행
  const events = new EventStrategy([
    new DeliveryEvent(),
    new ItemEvent(),
    new ConvenienceStoreEvent('씨유', 10, 5000),
    // 이 외에 추가되는 이벤트는 하위 알고리즘 객체 추가로 대응하자!
  ])
  
  console.log(
    events.calculatePrice(10000, '배달비 이벤트', 1, 2, 3, 4),
    events.calculatePrice(10000, '상품 이벤트', [
      { name: '빙빙', price: 1000, dcAmount: 1000 },
      { name: '전담', price: 5000, dcAmount: 500 },
      { name: '끌레도루', price: 4000 },
    ]),
    events.calculatePrice(10000, '제휴 이벤트'),
  )
}
