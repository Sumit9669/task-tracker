import { Request } from "express";
import { HttpService } from "@shared/http.service";
import { BusinessSyncSettingDefaultParams } from "src/enums/sync-setting-enums";

export class CommonFunctions {
  httpService: HttpService;
  constructor() {
    this.httpService = new HttpService();
  }

  /**
   * This function is for string formatting or insert values in string
   * @param str string
   * @param arg Arguments to insert into string
   */
  stringFormat(str: string, arg: string[]) {
    let i: number = 0;
    for (; i < arg.length; i++) {
      str = str.replace("{" + i + "}", arg[i]);
    }
    return str;
  }

  /**
   *  get the ip from where request has been initiated
   * @param req pass the express request object and get the ip address
   */
  getUserIPAdderess(req: Request) {
    let ipAddress = "";
    if (req.headers["client-ip"]) {
      ipAddress = req.headers["client-ip"] as string;
    } else {
      ipAddress = (req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress) as string;
    }
    return ipAddress;
  }

  uuid4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      // tslint:disable: no-bitwise
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  createQuerystring = (data: string[]) => {
    let queryinitialstring = "(";
    data.forEach((element: any, index: number, res: any) => {
      if (index === res.length - 1) {
        queryinitialstring += "'" + element + "'";
      } else {
        queryinitialstring += "'" + element + "',";
      }
    });
    queryinitialstring += ")";
    return queryinitialstring;
  };

  /**
   * lower the string
   * @param str
   */
  lowerTheString(str: any) {
    return str.toLowerCase();
  }

  /**
   * to get number of record that are skipped
   * @param pageNumber pass page number
   * @param pageSize pass page size
   */
  public paginationLogic(pageNumber: number, pageSize: number) {
    pageNumber = pageNumber || BusinessSyncSettingDefaultParams.pageNumber;
    pageSize = pageSize || BusinessSyncSettingDefaultParams.pageSize;
    return { offset: (pageNumber - 1) * pageSize, pageSize, pageNumber };
  }
}
