//
//  DetailedPageViewController.swift
//  Stadiumly
//
//  Created by Hee  on 5/25/25.
//

import UIKit
import SnapKit

//식당 디테일 페이지
class DetailedPageViewController: UIViewController {
    
    //테스트용 데이터받는곳
    var detailData: String?
    
    private let imageView = UIImageView()
    private let nameLabel = UILabel()
    private let locationLabel = UILabel()
    private let menuLabel = UILabel()
    private let operatingHoursLabel = UILabel()
    private let recommendedNumber = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupAddSubview()
        setupConstraints()
        configureUI()
    }
    
    //addSubView
    func setupAddSubview() {
        [imageView, nameLabel, locationLabel, menuLabel, operatingHoursLabel, recommendedNumber].forEach {
            view.addSubview($0)
        }
    }
    //오토 레이아웃
    func setupConstraints() {
        nameLabel.snp.makeConstraints {
            $0.top.equalToSuperview().offset(30)
            $0.leading.equalToSuperview().offset(20)
        }
        recommendedNumber.snp.makeConstraints {
            $0.top.equalToSuperview().offset(38)
            $0.trailing.equalToSuperview().inset(30)
        }
        imageView.snp.makeConstraints {
            $0.top.equalTo(nameLabel.snp.bottom).offset(5)
            $0.centerX.equalToSuperview()
            $0.width.equalTo(250)
            $0.height.equalTo(200)
        }
        locationLabel.snp.makeConstraints {
            $0.top.equalTo(imageView.snp.bottom).offset(20)
            $0.leading.equalToSuperview().offset(20)
        }
        menuLabel.snp.makeConstraints {
            $0.top.equalTo(locationLabel.snp.bottom).offset(20)
            $0.leading.equalToSuperview().offset(20)
        }
        operatingHoursLabel.snp.makeConstraints {
            $0.top.equalTo(menuLabel.snp.bottom).offset(20)
            $0.leading.equalToSuperview().offset(20)
        }
    }
    //UI 속성
    func configureUI() {
        guard let fooddata = detailData else { return }
        view.backgroundColor = .white
        imageView.image = UIImage(named: fooddata)
        nameLabel.text = "식당 이름"
        nameLabel.font = UIFont.boldSystemFont(ofSize: 30)
        recommendedNumber.text = "추천수 : ???"
        locationLabel.text = "주소 : 서울 서초구 서초대로74길 33 "
        menuLabel.text = "메뉴 : 돈까스"
        operatingHoursLabel.text = "운영시간 : 10:00 ~ 20:00"
        
    }
  
}
