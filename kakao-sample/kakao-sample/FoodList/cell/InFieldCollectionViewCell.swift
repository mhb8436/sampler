//
//  InFieldCollectionViewCell.swift
//  Stadiumly
//
//  Created by Hee  on 5/25/25.
//

import UIKit
import SnapKit

class InFieldCollectionViewCell: UICollectionViewCell {
    
    static let identifier = "inFieldcell"
    
    private let imageView = UIImageView()
    private let nameLabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupAddSubview()
        setupConstraints()
        configureUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func setupAddSubview() {
        contentView.addSubview(imageView)
        imageView.addSubview(nameLabel)
    }

    func setupConstraints() {
        imageView.snp.makeConstraints {
            $0.verticalEdges.equalToSuperview()
            $0.horizontalEdges.equalToSuperview()
        }
        nameLabel.snp.makeConstraints {
            $0.bottom.equalToSuperview().inset(10)
            $0.centerX.equalToSuperview()
        }
    }
    func configureUI() {
        contentView.backgroundColor = .lightGray
        contentView.layer.cornerRadius = 15
        contentView.layer.masksToBounds = true
        nameLabel.text = "구장 내 먹거리"
    }
    //외부에서 셀을 구성할 때 이미지 이름으로 이미지를 설정해주는 역할
    func configure(with imageName: String) {
        imageView.image = UIImage(named: imageName)
    }
    
}
