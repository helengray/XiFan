//
//  OrientationModule.swift
//  XiFan
//
//  Created by helen on 2016/12/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

import UIKit

@objc(OrientationModule)
class OrientationModule: NSObject {
  
  @objc func setOrientation(_ ori:Int)->Void{
    DispatchQueue.main.async(execute: {
      if(ori == UIInterfaceOrientation.landscapeLeft.rawValue
        || ori == UIInterfaceOrientation.portrait.rawValue){
        UIDevice.current.setValue(ori, forKey: "orientation");
      }
    });
  }
}
