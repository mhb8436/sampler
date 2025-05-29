//
//  FoodListViewController.swift
//  Stadiumly
//
//  Created by Hee  on 5/22/25.
//

import UIKit
import SnapKit


struct KakaoSearch: Codable {
    let documents: [Place]
}

struct Place: Codable {
    let place_name: String
    let place_url: String
    let x: String
    let y: String
    
}

//먹거리 페이지
class FoodListViewController: UIViewController {
    
    //데이터 전달예정 페이지 델리게이트
    weak var delegate: FoodSearchDelegate?
    
    let apiKey = "a1ca20c12106778d413b69fdaace0b23"
    
    private let xmarkButton = UIButton()
    private let searchBarView = UIView()
    private let foodTitleLabel = UILabel()
    //커스텀 button 세그먼트
    private let foodMenuTitle = ["구장 내 먹거리", "야구 선수 추천", "구장 외 먹거리"]
    private var menuButton: [UIButton] = []
    private let selectorView = UIView()
    private var selectedButtonIndex = 0
    private let segmentBackgroundView = UIView()
    private let buttonStackView = UIStackView()
    let searchBar = UISearchBar()
    //하단에 표시할 뷰컨들
    let infieldFoodVC = InFieldFoodViewController()
    let outfieldFoodVC = OutFieldFoodViewController()
    let playerRecommedVC = PlayerRecommedViewController()
    let containerView = UIView()
    var currentChildVC: UIViewController?
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupAddSubview()
        setupConstraints()
        configureUI()
        setupProperty()
        setupSegement()
        showChildViewController(infieldFoodVC)
        updateSelector(animaited: false)
        
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        updateSelector(animaited: true)
    }
    //addSubview
    func setupAddSubview() {
        [xmarkButton, searchBar, foodTitleLabel, segmentBackgroundView, searchBarView, containerView].forEach {
            view.addSubview($0)
        }
        segmentBackgroundView.addSubview(buttonStackView)
        searchBarView.addSubview(searchBar)
        
    }
    //오토레이아웃
    func setupConstraints() {
        foodTitleLabel.snp.makeConstraints {
            $0.top.equalToSuperview().offset(80)
            $0.centerX.equalToSuperview()
        }
        xmarkButton.snp.makeConstraints {
            $0.top.equalToSuperview().offset(80)
            $0.trailing.equalToSuperview().inset(20)
            $0.width.height.equalTo(20)
        }
        searchBar.snp.makeConstraints {
            $0.top.equalTo(foodTitleLabel.snp.bottom).offset(20)
            $0.horizontalEdges.equalToSuperview()
        }
        searchBarView.snp.makeConstraints {
            $0.top.equalTo(foodTitleLabel.snp.bottom).offset(20)
            $0.height.equalTo(50)
            $0.horizontalEdges.equalToSuperview()
        }
        segmentBackgroundView.snp.makeConstraints {
            $0.top.equalTo(searchBar.snp.bottom).offset(15)
            $0.centerX.equalToSuperview()
            $0.width.equalTo(385)
            $0.height.equalTo(50)
        }
        buttonStackView.snp.makeConstraints {
            $0.top.equalToSuperview()
            $0.bottom.equalToSuperview()
            $0.horizontalEdges.equalToSuperview()
        }
        containerView.snp.makeConstraints {
            $0.top.equalTo(buttonStackView.snp.bottom).offset(10)
            $0.horizontalEdges.equalToSuperview()
            $0.bottom.equalToSuperview()
        }
    }
    //UI 속성
    func configureUI() {
        view.backgroundColor = .white
        foodTitleLabel.text = "먹거리"
        foodTitleLabel.font = .systemFont(ofSize: 20)
        xmarkButton.setImage(UIImage(named: "xmark"), for: .normal)
        searchBar.searchBarStyle = .minimal
        searchBar.placeholder = "먹거리를 검색해 주세요"
        searchBar.backgroundColor = .clear
        searchBar.setImage(UIImage(systemName: "xmark")?.withTintColor(.black, renderingMode: .alwaysOriginal), for: .clear, state: .normal)
        segmentBackgroundView.backgroundColor = UIColor(white: 0.1, alpha: 1)
        segmentBackgroundView.layer.cornerRadius = 24
        buttonStackView.axis = .horizontal
        buttonStackView.distribution = .fillEqually
        selectorView.backgroundColor = UIColor(white: 0.25, alpha: 1)
        selectorView.layer.cornerRadius = 20
        segmentBackgroundView.insertSubview(selectorView, at: 0)
        
        if let textField = searchBar.value(forKey: "searchField") as? UITextField {
            textField.backgroundColor = UIColor(white: 0.95, alpha: 1)
            textField.layer.cornerRadius = 20
            textField.clipsToBounds = true
            textField.layer.masksToBounds = true
            textField.borderStyle = .none
        }
        searchBarView.layer.shadowRadius = 0.5
        searchBarView.layer.shadowOpacity = 0.1
        searchBarView.layer.shadowColor = UIColor.black.cgColor
    }
    //property
    func setupProperty() {
        searchBar.delegate = self
        self.delegate = outfieldFoodVC
    }
    
}
//MARK: - 푸드 검색 API
extension FoodListViewController {
    // longitude: Double, latitude: Double
    func searchFood(query: String?) {
        guard let query else { return }
        let endPoint = "https://dapi.kakao.com/v2/local/search/keyword.json?query=\(query)&category_group_code=FD6&x=\(126.866788407)&y=\(37.496659317)"
        guard let url = URL(string: endPoint) else { return }
        var request = URLRequest(url: url)
        request.addValue("KakaoAK \(apiKey)", forHTTPHeaderField: "Authorization")
        let seesion = URLSession.shared
        let task = seesion.dataTask(with: request) { data, _ , error in
            if let error = error {
                print("요청 실패 Error")
                return
            }
            guard let data else {
                print("데이터가 없습니다")
                return
            }
//            print(String(data: data, encoding: .utf8) ?? "❌문자열 변환 실패")
            do {
                let decoded = try JSONDecoder().decode(KakaoSearch.self, from: data)
                DispatchQueue.main.async {
                    self.delegate?.didReceiveSearchResults(decoded.documents)
                }
            } catch {
                print("디코딩 실패\(error)")
            }
        }
        task.resume()
    }
    
}
//MARK: - 커스텀 세그먼트 함수들
extension FoodListViewController {
    //버튼,타이틀
    func setupSegement() {
        for(index, title) in foodMenuTitle.enumerated() {
            let button = UIButton(type: .system)
            button.setTitle(title, for: .normal)
            button.setTitleColor(index == selectedButtonIndex ? .white : .lightGray, for: .normal)
            button.titleLabel?.font = UIFont.systemFont(ofSize: 15, weight: .semibold)
            button.tag = index
            button.addTarget(self, action: #selector(segementTapped(_:)), for: .touchUpInside)
            menuButton.append(button)
            buttonStackView.addArrangedSubview(button)
        }
    }
    //커스텀 세그먼트 애니메이션, 텍스트컬러
    func updateSelector(animaited: Bool) {
        //텍스트 컬러 업데이트
        for (i, btn) in menuButton.enumerated() {
            btn.setTitleColor(i == selectedButtonIndex ? .white : .lightGray , for: .normal)
        }
        
        //selectorView 애니메이션
        let selectedButton = menuButton[selectedButtonIndex]
        let selectorFrame = selectedButton.frame.insetBy(dx: 4, dy: 6)
        
        if animaited {
            UIView.animate(withDuration: 0.25) {
                self.selectorView.frame = selectorFrame
            }
        } else {
            self.selectorView.frame = selectorFrame
        }
    }
    //세그먼트 텝별로 다른 화면 보여주기
    func showChildViewController(_ vc: UIViewController) {
        if let current = currentChildVC {
            current.willMove(toParent: nil)
            current.view.removeFromSuperview()
            current.removeFromParent()
        }
        addChild(vc)
        containerView.addSubview(vc.view)
        vc.view.frame = containerView.bounds
        vc.view.isUserInteractionEnabled = true
        vc.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        vc.didMove(toParent: self)
        currentChildVC = vc
    }
    //세그먼트 텝버튼 함수
    @objc func segementTapped(_ sender: UIButton) {
        selectedButtonIndex = sender.tag
        updateSelector(animaited: true)
        switch sender.tag {
        case 0: showChildViewController(infieldFoodVC)
        case 1: showChildViewController(playerRecommedVC)
        case 2: showChildViewController(outfieldFoodVC)
        default: break
        }
    }
}
//MARK: - 서치바 설정
extension FoodListViewController: UISearchBarDelegate {
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        searchFood(query: searchBar.text)
        searchBar.resignFirstResponder()
    }
}
