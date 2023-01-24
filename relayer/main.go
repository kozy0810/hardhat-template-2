package main

import (
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"os"
	"relayer/api"
)

const (
	GREETER_ADDRESS       = "0x3f06EC073dC2658cDd42eB070e99df5289a5802a"
	ERC20_ADDRESS         = "0xBB490D7277726178f4C0Fb4e9c6Ce11C1e32ff08"
	SIGNER_PRIVATE_KEY    = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
	RECEIVER_PRIVATE_KEY1 = "59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
	SPENDER_ADDRESS       = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
)

type PermitRequest struct {
	V uint8  `json:"v"`
	R string `json:"r"`
	S string `json:"s"`
}

func main() {
	//ec, err := ethclient.Dial("http://127.0.0.1:8545/")
	//if err != nil {
	//	log.Fatalf("EthClient Error: %v\n", err)
	//}
	//
	//token, err := erc20Token.NewErc20Token(common.HexToAddress(ERC20_ADDRESS), ec)
	//if err != nil {
	//	log.Fatalf("NewErc20Token Error: %v\n", err)
	//}

	h, err := api.NewAPI()
	if err != nil {
		log.Fatalln(err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World"))
	})
	r.HandleFunc("/permit", h.PermitHandler).Methods(http.MethodPost, http.MethodOptions)

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Printf("failed to run server: %v\n", err)
		os.Exit(1)
	}
	log.Printf("Listen to server 8080")
}
