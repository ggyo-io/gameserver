// Code generated by go-bindata.
// sources:
// pieces/.DS_Store
// pieces/bB.svg
// pieces/bK.svg
// pieces/bN.svg
// pieces/bP.svg
// pieces/bQ.svg
// pieces/bR.svg
// pieces/wB.svg
// pieces/wK.svg
// pieces/wN.svg
// pieces/wP.svg
// pieces/wQ.svg
// pieces/wR.svg
// DO NOT EDIT!

package internal

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func bindataRead(data []byte, name string) ([]byte, error) {
	gz, err := gzip.NewReader(bytes.NewBuffer(data))
	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}

	var buf bytes.Buffer
	_, err = io.Copy(&buf, gz)
	clErr := gz.Close()

	if err != nil {
		return nil, fmt.Errorf("Read %q: %v", name, err)
	}
	if clErr != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

type asset struct {
	bytes []byte
	info  os.FileInfo
}

type bindataFileInfo struct {
	name    string
	size    int64
	mode    os.FileMode
	modTime time.Time
}

func (fi bindataFileInfo) Name() string {
	return fi.name
}
func (fi bindataFileInfo) Size() int64 {
	return fi.size
}
func (fi bindataFileInfo) Mode() os.FileMode {
	return fi.mode
}
func (fi bindataFileInfo) ModTime() time.Time {
	return fi.modTime
}
func (fi bindataFileInfo) IsDir() bool {
	return false
}
func (fi bindataFileInfo) Sys() interface{} {
	return nil
}

var _piecesDs_store = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xec\x98\x3b\x0e\xc2\x30\x10\x44\x77\x8c\x0b\x4b\x34\x2e\x29\xdd\x70\x00\x6e\x60\x45\xe1\x04\x5c\x80\x82\x2b\xd0\xfb\xe8\x24\xda\x11\xb2\x14\x52\x50\x25\x82\x79\x92\xf5\x56\x8a\x9d\x4f\xe3\xec\xd8\xcc\x30\x3c\x1f\x17\xb3\x3c\x95\xc9\xdc\x76\xb6\x8f\x24\x8e\x05\xa1\xab\xc1\x7b\x08\x21\x84\x10\x62\xdf\xc0\x95\x8e\xdb\xbe\x86\x10\x62\x87\xcc\xfb\x43\xa1\x2b\xdd\xdc\xe0\xf5\x40\xc7\x6e\x4d\xa6\x0b\x5d\xe9\xe6\x06\xe7\x05\x3a\xd2\x89\xce\x74\xa1\x2b\xdd\xdc\xdc\xb4\xc0\xf0\x01\x3e\x19\x4c\x28\x60\x0a\x41\xa1\xeb\x97\x1f\x2d\xc4\x9f\x70\x70\xe5\xf9\xff\x7f\xb5\xd5\xfc\x2f\x84\xf8\x61\x10\xc7\xdb\x38\xd8\x3b\x10\x2c\x27\x4c\xe3\xde\xd5\xcd\xd6\x9b\x80\xe0\x87\x85\xa7\x6e\x6d\xa1\x2b\xdd\xdc\x6a\x04\x84\xd8\x8a\x57\x00\x00\x00\xff\xff\x6a\x00\x88\x6d\x04\x18\x00\x00")

func piecesDs_storeBytes() ([]byte, error) {
	return bindataRead(
		_piecesDs_store,
		"pieces/.DS_Store",
	)
}

func piecesDs_store() (*asset, error) {
	bytes, err := piecesDs_storeBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/.DS_Store", size: 6148, mode: os.FileMode(420), modTime: time.Unix(1445781173, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesBbSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\x84\x54\xed\x72\x9b\x30\x10\xfc\x9f\xa7\xb8\x51\xfe\x3a\x42\x1f\x48\x7c\xc4\xce\x4c\xa7\x7f\xe3\x87\xa0\x41\x31\xb4\x04\x3c\x20\x9b\xba\x4f\x5f\x9d\x24\x08\x4d\x3a\x2d\x99\xa0\xf3\x6a\x6f\x77\x4f\x63\x79\x3f\x5d\x4f\xf0\xf3\xad\xeb\xa7\x03\x69\xac\x3d\x97\x49\x32\xcf\x33\x9d\x25\x1d\xc6\x53\x22\x18\x63\x89\x63\x10\xb8\x9a\x71\x6a\x87\xfe\x40\x38\xe5\x04\xe6\xb6\xb6\xcd\x81\xa4\x8a\x40\x63\xda\x53\x63\x7d\xfd\x74\x07\xb0\x3f\xc1\x64\x6f\x9d\x39\x90\xe1\x5c\xbd\xb4\xf6\x56\xf2\x47\x78\x6d\xbb\xae\xec\x87\xde\x84\xf2\x61\xbc\x74\xa6\x34\x57\xd3\x0f\x75\x1d\xa1\x0d\x7b\xb2\xe3\xf0\xc3\x94\xf7\xcc\x3f\xcb\xe7\x07\xef\x59\x72\xaa\x56\xa4\x6b\x7b\xf3\x52\x9d\xcb\x71\xb8\xf4\xf5\x1f\xe8\xf7\xa1\xed\x3f\xc0\x6f\xad\x35\x63\xd7\xba\xa5\x4c\x57\xb0\xae\xa6\xa6\x1a\xc7\xea\x16\xd3\x45\xf8\x3d\x8c\x9f\x69\x3b\x95\x1f\xe5\x43\xb4\x4f\x51\x97\x60\xdf\x2e\xd6\x2e\x12\x4e\xe4\x5c\xd9\x26\xd6\x00\xf5\x81\x1c\xa1\xd8\x49\x0d\x5f\x81\x0b\x2a\x5d\xa9\x28\x93\xc0\x0b\xca\xb9\x83\x69\x2a\x41\x08\xaa\x76\x32\x75\x0c\xa1\x68\x5e\x44\x54\x0a\xaa\x79\x64\x4b\x1d\x14\xc2\x2a\x33\xaa\x15\xb2\x54\x0a\x28\x98\xe3\x4e\x4e\xa5\x70\x25\x2d\x32\xdc\x97\xca\xd7\x85\xef\xc8\xa9\x42\x46\xd0\xcb\xa8\x92\x8b\x8f\x63\xe8\xe8\x9e\x79\x4e\x4c\xe5\xf1\x98\xd6\xf3\x8b\x45\xc4\x39\xa7\x3a\x4a\x6b\xaa\xb3\x2c\x5a\xea\x90\x02\x8d\x53\x4c\xc6\x74\x18\xda\xbf\x7e\x11\x48\xfe\x71\x3a\xdc\xd9\x0b\x34\xcf\xfc\x31\x38\x1f\xb1\x56\x92\x85\x3d\xc9\x10\x61\x11\x61\xf1\x8d\xf8\x0e\xc9\xa1\x43\xe8\x75\x75\x3b\x72\x27\xbc\x82\x74\x08\xf7\xaa\x38\x28\x67\x61\x50\xbe\xa0\x5c\x04\x1e\x5f\x3b\x97\xca\xe5\xf2\xda\x98\x0f\xbd\xc2\x8a\x4d\x21\x49\xc8\xfd\x9f\xe1\x84\x82\x1c\xbe\x80\x40\x7f\xf7\xef\xfa\xdd\x1f\x08\xb6\xfb\x1b\x8a\xdc\x77\xbd\x7d\x72\x8a\xc5\x56\x36\x1c\x59\x8c\xf8\xbc\x0e\x7c\x8c\xf1\x9e\xe3\xd1\x1c\xe3\xb8\xca\xc9\x3f\x87\x5a\x60\xe8\x23\x7a\xf3\x1c\x31\xb7\x9b\x93\x45\x76\xfb\xbd\xdf\x5e\x92\xf2\xfe\xd5\x3f\x9f\xef\x9d\xbf\x69\x8f\x31\xad\xcf\xba\xc7\xdf\x90\xa7\xbb\xdf\x01\x00\x00\xff\xff\x88\x7d\xb5\x19\x6c\x04\x00\x00")

func piecesBbSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesBbSvg,
		"pieces/bB.svg",
	)
}

func piecesBbSvg() (*asset, error) {
	bytes, err := piecesBbSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/bB.svg", size: 1132, mode: os.FileMode(420), modTime: time.Unix(1445797333, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesBkSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xa4\x54\xcb\x92\xdb\x20\x10\xbc\xfb\x2b\x28\x72\xd5\x22\x5e\x7a\xfa\x71\xf1\xd5\xf9\x08\x65\xc5\x4a\x24\x5a\xc9\x25\x61\x2b\xce\xd7\x07\x10\x60\xaf\x13\x3b\x49\x45\x07\xd3\x30\xc3\xd0\xdd\x33\xe5\xcd\x74\x6e\xc0\xf7\xf7\xae\x9f\xb6\xb0\x55\xea\x58\xc6\xf1\x3c\xcf\x68\x66\x68\x18\x9b\x98\x62\x8c\x63\x9d\x01\xc1\x59\x8c\x93\x1c\xfa\x2d\x24\x88\x40\x30\xcb\x5a\xb5\x5b\xc8\x13\x08\x5a\x21\x9b\x56\x59\xbc\x5b\x01\xb0\x69\xc0\xa4\x2e\x9d\xd8\xc2\x37\xd9\x75\x65\x3f\xf4\x62\x0d\x0c\x7c\x19\x8e\xd5\xab\x54\x97\x92\xb8\xfd\x78\xea\x44\x29\xce\xa2\x1f\xea\x7a\xad\x2f\x8d\xc3\x37\x51\x7e\xc2\xf6\xf3\xfb\x17\xfb\x50\x49\x50\x12\x4e\x3a\xd9\x8b\xd7\xea\x58\x8e\xc3\xa9\xaf\xd7\x37\x87\x5f\x07\xd9\x7f\x3c\x7d\x97\x4a\x8c\x9d\xd4\x4b\xc9\xc3\xfd\xba\x9a\xda\x6a\x1c\xab\x8b\xe3\xe6\x8e\xaf\xec\xac\x0c\x2d\xe4\x58\xa9\xd6\x22\xfd\xd5\x5b\xf8\x19\x50\x8a\x92\x88\x10\x94\x32\x70\x58\x36\x29\xf4\x09\xbf\x6a\x7e\x20\x28\x30\xb5\xe4\xd6\xa1\x80\xd4\x4f\x98\x17\xd3\x24\xc3\x10\xc4\x4f\x39\xd0\x04\xec\x03\xa2\x59\x44\x32\xa4\xd7\xc4\xb0\xe3\xc8\xc6\x02\xa6\xdc\x20\xea\xb8\x53\x13\xc3\x0b\x22\x85\xcf\xb9\xa2\x3d\x20\xb9\xab\xe6\xab\x2f\xeb\x6f\x75\x7a\x69\xf7\xdd\xbd\x6b\xd4\x97\x93\x52\x0f\xe5\x3f\x56\xaa\x8d\x4e\x22\x96\x19\x4e\x59\xc4\x31\xb2\x4a\xed\xca\xe8\x12\x39\x38\x84\x75\x8e\x47\x9c\x58\xbe\x26\x2b\x37\xaa\x0a\xab\x8a\x59\x17\x98\xf6\x25\x22\xa9\xd3\xc4\x74\xc4\xb5\x91\x66\x01\xb1\xc5\x85\xc2\xe4\x15\xcb\xa5\xf4\xa6\x8e\x2f\x6e\xc9\xd1\xe2\x03\x3a\x04\xca\x3f\xc0\x53\xbf\xee\x47\xe3\x59\xbb\x71\x94\x1b\x6e\x49\x94\xff\xff\xa8\x3d\x7e\x86\xd1\x45\xc2\x3e\x20\x63\x74\xf0\x11\x33\x63\x40\xee\x9c\x24\x66\x58\xac\x95\xb9\x33\x8d\x07\x2b\x49\x44\x53\x94\x06\x37\xdd\x34\x62\x93\x5a\xa0\x02\xa7\xe6\x66\x8a\x8a\x22\x0b\x05\xf9\x8d\xa5\xb9\x86\xb9\x39\xbe\xc1\x7f\x21\xfb\xcd\x7e\x7f\x9e\x25\xbc\xcc\x92\xee\x36\xb5\xbf\x7e\x66\x7c\xdc\xf5\x3e\xd3\x67\xcb\xb4\xb1\xeb\xb4\x99\xd8\xdd\x4c\x32\x6e\x73\xb8\x9f\xc7\x7f\x66\xba\x89\x9b\xdd\x6a\x63\xfe\x5e\x77\xab\x9f\x01\x00\x00\xff\xff\x43\xf4\x20\xfb\x87\x05\x00\x00")

func piecesBkSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesBkSvg,
		"pieces/bK.svg",
	)
}

func piecesBkSvg() (*asset, error) {
	bytes, err := piecesBkSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/bK.svg", size: 1415, mode: os.FileMode(420), modTime: time.Unix(1445797339, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesBnSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xac\x54\xcb\x6e\xe2\x4a\x10\xdd\xe7\x2b\x4a\xbe\x9b\x7b\xa5\xa6\xe8\x87\xbb\xed\x76\x20\xd2\x15\xdb\xcc\x47\x58\xc1\x01\xcf\x80\x8d\x8c\x13\x92\x7c\xfd\x9c\xb2\x0d\x64\xa2\x44\x9a\x45\x90\xe8\x7a\x75\x57\x9d\x7a\x79\x71\x7c\xde\xd0\xcb\x7e\xd7\x1c\x97\xc9\xb6\xef\x0f\xc5\x7c\x7e\x3a\x9d\xf8\xe4\xb8\xed\x36\x73\xab\xb5\x9e\xe3\x46\x42\xcf\x55\x77\xac\xdb\x66\x99\x18\x36\x09\x9d\xea\x75\xbf\x5d\x26\xa9\x4f\x68\x5b\xd5\x9b\x6d\x3f\xf0\x77\x37\x44\x8b\x0d\x1d\xfb\xd7\x5d\xb5\x4c\xda\x43\xf9\x50\xf7\xaf\x85\xb9\xa5\xc7\x7a\xb7\x2b\x9a\xb6\xa9\x46\x76\xf6\xc1\x34\xeb\x9e\x76\x55\x51\x3d\x57\x4d\xbb\x5e\xdf\xe2\x7d\xd7\xfe\xaa\x8a\x7f\xf4\xf0\x3b\xcb\xb3\x21\x66\x61\xd8\x5f\x34\xbb\xba\xa9\x1e\xca\x43\xd1\xb5\x4f\xcd\xfa\xf6\x9d\xf2\x67\x5b\x37\x7f\x6a\xf7\x75\x5f\x75\xbb\x1a\xa4\x48\x2f\xef\xd7\xe5\x71\x5b\x76\x5d\xf9\x3a\x61\x9b\xd4\x57\x74\x43\x46\xc8\xe9\x50\xf6\xdb\x81\x23\x5a\x2f\x93\x1f\x64\xad\x32\x9a\x56\xe4\x2c\x7b\x65\x0c\xb9\x5c\x68\x0e\xaa\x5c\xa4\x7b\x32\x5e\xe8\x6a\xa0\x9a\x2c\x4e\x5c\x24\xeb\x70\x27\x99\xfc\x4c\x45\x1a\x2a\xf3\x21\xd3\x8b\x9c\xd0\xfc\x2b\x00\xa9\x84\x5b\x81\x32\x62\x5a\xcd\xd1\x90\xc9\x39\xf5\xca\x7a\x76\x19\x99\xa0\x6c\x26\x00\x9c\xb2\x11\x27\x1b\x20\x33\xec\x52\x32\x06\x0c\x2c\x91\xa3\x87\x4e\xb3\x0e\x64\x2c\xa7\x06\x0f\x38\x06\xb1\x5b\xf1\x6c\xb4\x50\x83\x6e\x47\xb8\x60\xeb\x44\xe3\x24\xe9\x28\xc4\x73\x8c\x99\x78\x42\xa0\x00\x25\x08\x7c\xa3\x2c\xe7\x73\x75\x96\x1c\xe7\x51\x21\x02\x00\x02\xb4\x46\x1d\x04\x16\xdb\x4c\x45\xf6\x12\xdc\xa1\x76\xa8\xdf\xc8\x64\xa3\x3d\x05\x1b\x44\x17\xa4\xb0\xfa\x42\xef\x25\x4b\x3f\x16\xff\xcc\x19\xa0\xcb\xe1\x41\xeb\x9c\xac\x51\x92\x36\xfa\x93\x4d\x4d\x1a\xce\xef\x29\x7a\x94\x1e\x7a\x1c\xff\x93\xa4\x31\xfc\x09\x69\x91\x00\xf9\xd4\x70\x79\xf1\xf6\x29\x82\xc7\xe1\x77\x45\x30\xc9\x5f\x23\x30\xa8\xc8\x35\x8e\xb9\xc4\x19\x4a\xfb\xb9\x61\x7a\x71\x01\xd0\x77\x65\x73\x7c\x6c\xbb\xfd\x32\xd9\x97\x7d\x57\xbf\xfc\xab\x39\x0f\x41\xe1\x9d\x9a\xc9\x31\x8a\x91\x43\x74\x6a\xe6\xd9\x64\xee\xbf\xef\x01\x8f\x59\xf5\xd2\x30\x4e\xd1\x46\x08\x06\x9b\xc3\xb9\x1f\x85\x80\x11\x91\xc6\x65\x9c\xe1\x8e\x23\x0c\x26\xd6\x06\x73\x90\xc6\x69\xcb\x72\x58\x64\xe5\x52\xb9\x61\x1d\x6b\xac\x9d\x1f\xf8\x28\x33\x0c\xde\xfa\x71\xfb\x84\x05\xc7\xe2\xda\x65\xb2\x14\x57\x61\x5a\x4c\x59\x9a\x9c\x63\x4a\x2e\x70\xb0\xca\x62\x3c\xbd\xb8\x96\x98\x19\x07\x99\x68\xac\x4b\x9e\x2b\x59\x1d\x8c\x12\x56\x2b\x08\x5c\x6d\xa5\x9f\x3a\x8c\x83\x7c\xff\x3e\xa7\x37\xfa\x9b\x32\x0d\x1f\x9a\xa9\x46\x8b\xf9\xe6\xee\x66\x21\x9f\xd7\xbb\x9b\xdf\x01\x00\x00\xff\xff\x7e\xb7\x48\xaf\x87\x05\x00\x00")

func piecesBnSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesBnSvg,
		"pieces/bN.svg",
	)
}

func piecesBnSvg() (*asset, error) {
	bytes, err := piecesBnSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/bN.svg", size: 1415, mode: os.FileMode(420), modTime: time.Unix(1445797343, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesBpSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\x5c\x92\xcd\x72\x9b\x30\x10\xc7\xef\x7e\x8a\x1d\xf5\x8a\x05\xfa\x02\xa4\x18\x5f\x72\x6d\x1f\x82\x89\x55\xa3\x96\x20\x46\x28\xa1\xce\xd3\x77\x25\x08\x99\x96\x03\xfa\xed\x7f\x3f\xb4\xbb\x70\x59\xde\xef\xf0\xe7\x75\x9c\x96\x8e\x0c\x31\xce\xa6\x2c\xd7\x75\xa5\xab\xa0\x3e\xdc\x4b\x5e\x55\x55\x89\x11\x04\xde\x6d\x58\x9c\x9f\x3a\xc2\x28\x23\xb0\xba\x5b\x1c\x3a\x22\x15\x81\xc1\xba\xfb\x10\x33\x5f\x4f\x00\x97\xb9\x8f\x03\x9e\x00\xb7\x8e\xfc\x00\xce\x0b\x0d\xcf\xc0\x34\x6d\x34\x12\x6b\x0b\x56\x21\x66\x10\xc9\x91\x4e\xda\x26\x81\x72\x5d\x30\x49\x1b\x96\xb8\x41\x5d\x51\xd1\xa6\x90\x9a\xb6\xa2\xc0\xb7\x02\x94\x54\x81\x5e\xa5\x37\xe4\x2c\xf9\x33\x09\x5a\x89\x14\x2a\x65\xc1\x25\x6d\x25\xb0\x86\x6a\x56\xf0\x3a\xe9\x18\x24\xb3\xd5\xd0\x0a\x53\x2b\x4c\x10\x8c\xaa\x76\x47\x8d\xa5\xbf\x83\x10\x9f\xfc\xbc\x73\x0e\xe1\x1a\x73\xf6\xcc\x54\x4d\x1f\x35\x51\x53\xf5\x7e\x1b\x6f\x8f\x26\x36\x4c\x9d\x65\xda\xda\xc5\x58\xd6\x6c\x43\x70\x45\x71\x2b\x9f\xd3\xa1\xd5\xb0\x7d\x6e\x5e\xef\xcb\xc8\x90\x9c\xf5\xbe\x2e\xbc\x84\x33\xdc\x5f\x5e\xe7\x07\x90\xbc\xe0\x25\x3e\x46\xdb\x11\x3f\xf7\x2f\x2e\x3e\x0c\x7b\x82\x9f\x6e\x1c\xcd\xb7\x2a\x3f\x9b\x75\xfe\xcf\x7b\x0e\x6f\xa3\x35\x93\x9f\x3e\x6c\xf0\x4f\x58\x22\xf8\xdf\xf6\x2b\x65\xb3\xcf\xf9\xf3\x1a\x1c\xff\x50\x46\x37\xd9\x97\x7e\x36\xc1\xbf\x4d\xb7\x7f\xd4\x5f\xde\x4d\xe6\xd5\x45\x1b\x0e\x39\x5b\xa3\xc3\xc3\xc8\x43\xbc\xf5\xcb\xd0\x87\xd0\x3f\xd2\xed\xf6\x90\xbf\xfa\x23\x50\x5e\x4f\x97\xf4\xb7\x5d\x4f\x7f\x03\x00\x00\xff\xff\x4f\x2d\x50\x9e\x96\x02\x00\x00")

func piecesBpSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesBpSvg,
		"pieces/bP.svg",
	)
}

func piecesBpSvg() (*asset, error) {
	bytes, err := piecesBpSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/bP.svg", size: 662, mode: os.FileMode(420), modTime: time.Unix(1445797348, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesBqSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xac\x55\xc1\x72\x9b\x30\x10\xbd\xe7\x2b\x34\xea\x15\x0b\x49\x0b\xd8\x60\x93\x99\x8e\xaf\xe9\x47\x50\x50\x0c\x2d\x01\x0f\xc6\x76\xdc\xaf\xef\x4a\x48\xe0\x90\xd6\x71\x66\x82\x0f\xbb\xda\x7d\xda\x7d\xfb\x24\xf0\xe6\x70\xda\x91\xd7\x97\xba\x39\xa4\xb4\xec\xfb\x7d\xe2\xfb\xe7\xf3\x99\x9d\x81\xb5\xdd\xce\x97\x9c\x73\x1f\x11\x94\x9c\x54\x77\xa8\xda\x26\xa5\x82\x09\x4a\xce\x55\xd1\x97\x29\x0d\x42\x4a\x4a\x55\xed\xca\xde\xf8\x8f\x0f\x84\x6c\x76\xe4\xd0\x5f\x6a\x95\xd2\x76\x9f\xe5\x55\x7f\x49\xc4\x9a\x3c\x57\x75\x9d\x70\xf3\x0c\x8b\xc5\x2c\xb9\xe8\x8e\xb5\x4a\xd4\x49\x35\x6d\x51\xac\xb1\x42\xd7\xfe\x56\xc9\x37\xb7\x65\x58\x2f\x4c\xd7\x44\xb0\x70\x8c\xd4\x55\xa3\xf2\x6c\x9f\x74\xed\xb1\x29\xd6\x57\xc1\x5f\x6d\xd5\xbc\x8d\xbe\x54\xbd\xea\xea\x0a\x4d\x12\x8c\xfb\x8b\xec\x50\x66\x5d\x97\x5d\x92\xa6\x6d\xd4\x18\x9e\xd8\x99\x99\xae\xa7\x32\xa3\xcc\x88\x0d\x9b\x2d\x14\xc1\x79\xd5\xe5\xb5\x22\xf9\x6b\x4a\x23\xaa\x23\xf9\x05\x75\x93\x94\x74\x29\x95\x6c\x89\xa2\xf9\xff\xc2\x8a\x80\x5a\x6c\x8c\xce\x6d\xac\x94\x0c\x53\x1a\xbb\xfa\x10\x0b\xe2\xfe\xba\x10\xd3\x1b\x7c\x37\xfe\xce\x3a\xfb\xac\x2f\xed\x76\x52\xa4\xf4\x07\x89\x3d\x19\x91\x2d\x11\x4b\x16\x7a\x32\x60\x21\x01\x6e\x6d\xa4\x33\x4f\x04\x56\x98\x11\x80\x11\xf4\x85\x27\x8d\xe5\x6c\xe9\x09\xce\x62\xf4\x65\xe8\x76\xa2\x2f\x35\x96\xa3\x27\xe2\x29\x2a\x02\x06\x0e\x2d\x82\xa1\x42\x34\x15\x35\x0c\xfe\x50\xc7\xca\x9e\xd7\xec\xa2\xfc\x3c\xf6\xfd\xbb\xfb\x35\xcd\xf7\xbf\xb1\xd0\xac\x08\xb6\x0e\x8d\xc5\x1b\xe8\x01\xd7\xd3\x6a\x9e\x80\x4b\xe7\xa1\xf5\x40\xd3\xd9\x0e\x68\xd0\xcc\x07\x2f\x1a\xad\x2e\x07\x4b\x9d\x10\x9e\x56\x65\xb4\x56\x3e\xc0\x99\x89\x1c\x3d\x08\x5c\xd6\x79\xa0\xa5\x32\x15\x74\x24\xb2\x99\x88\xe8\x6e\x43\x4b\x00\x47\x03\x2c\x31\x18\xa9\xea\xc4\x40\xdf\xe0\x71\x20\x7d\x44\x2b\x7b\x50\xdb\xa1\xb3\x91\x7c\x3a\xcc\xfb\xb5\xbd\xa1\xa5\x1b\xf3\x3b\x0e\xe0\x01\x96\x27\x1c\x7f\x76\xa8\x79\x6d\xf3\x9e\x5d\xbf\x94\xef\xbe\x06\x9f\x68\x2b\xe3\x37\x4d\x85\x6e\x2a\xe3\x3b\x5a\x3e\x9b\xe7\x66\xf5\x51\xd7\xa7\x49\xe3\xaf\xa9\x2c\xdc\x69\xce\x04\x03\x1b\xff\x9a\x2e\xdc\xdd\xa5\xf9\xb1\xd8\xf8\xa7\xbb\x98\x8f\xc4\x46\xff\x6b\x3c\x3e\xfc\x0d\x00\x00\xff\xff\xd0\x03\xeb\x88\x5e\x06\x00\x00")

func piecesBqSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesBqSvg,
		"pieces/bQ.svg",
	)
}

func piecesBqSvg() (*asset, error) {
	bytes, err := piecesBqSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/bQ.svg", size: 1630, mode: os.FileMode(420), modTime: time.Unix(1445797352, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesBrSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xbc\x55\xd1\xb2\x9b\x20\x10\x7d\xcf\x57\xec\x70\x5f\x13\x15\x51\x67\x44\xcd\x17\xb4\x1f\x61\xaf\x5c\xa5\xf5\x82\x83\x24\x36\xfd\xfa\x22\x2a\x1a\x67\xda\xc9\x4c\xda\xf8\x72\x0e\x0b\xec\xd9\x65\x77\xc7\xbc\xbf\xd6\xf0\xf3\xb3\x15\x7d\x81\x1a\xad\x3b\xea\xfb\xc3\x30\x78\x03\xf1\xa4\xaa\xfd\x30\x08\x02\xdf\x9c\x40\x70\x65\xaa\xe7\x52\x14\x08\x7b\x18\xc1\xc0\x2b\xdd\x14\x28\x8a\x11\x34\x8c\xd7\x8d\xb6\xfc\x7c\x00\xc8\x6b\xe8\xf5\xad\x65\x05\x92\x5d\xf9\xce\xf5\x8d\xe2\x0c\x3e\x78\xdb\xd2\xc0\x7e\xd3\xe2\xb4\xdb\x3c\xa9\x4b\xcb\x28\xbb\x32\x21\xab\x2a\x33\x1e\x94\xfc\xc1\xe8\xdb\x72\x65\x5a\x9f\xac\x2a\xc5\x5e\xec\x2c\x2d\x17\xec\xbd\xec\xa8\x92\x17\x51\x65\x1b\xe3\x77\xc9\xc5\xbd\xf5\x93\x6b\xa6\x5a\x6e\x80\x46\xee\x7e\x55\xf6\x4d\xa9\x54\x79\xa3\x42\x0a\xe6\xcc\x6b\x74\x36\x27\x93\x55\x57\xea\xc6\x32\x80\xaa\x40\x5f\x21\x3d\x92\x14\xbe\x00\x49\x56\x4c\x0c\xa6\x0e\x52\xf8\x05\x68\xbe\x31\x3f\xc8\x2e\xe6\x6f\x17\xad\x33\x04\xfe\x1f\x14\x70\xe8\xc5\x47\x12\x1a\x6f\x38\x3a\x86\xa9\x17\x8f\x32\xd8\xb1\x75\x77\x66\x4f\xcb\x4d\xa1\x8f\x38\xba\x25\x64\xc5\xc5\x9e\x3c\x2d\xe2\x32\x31\x0c\x27\x4b\x4e\x2b\x5b\x77\x2d\x7b\x48\x6e\x5f\x75\x5b\xe8\xbf\x07\x31\x0b\x62\x23\x1d\x8d\xc2\xd1\x8c\x2e\x94\xe5\xcc\xb3\xf9\xce\x02\x06\xc7\x2e\xc1\xf1\x02\x18\x1b\x0c\x03\x87\xa3\x39\x8c\x17\xb0\x56\x12\x38\x4c\xa7\x18\xd3\x4d\xa8\x93\xe7\x7f\x50\xf3\x78\x7a\x7a\xb2\x63\x3b\xbf\x76\x80\xb7\x23\x42\xdf\x3e\xec\xb7\x9f\xcd\xbb\xc9\x7c\xac\x1c\x46\x10\xcf\x3d\x6d\xd9\x0b\xa5\xf7\x83\xf5\x52\xe9\xfb\xfe\x7f\xa1\xf4\xb6\xeb\xff\x93\x6c\xee\xd7\xe7\x43\x3e\xfe\x39\xce\x87\xdf\x01\x00\x00\xff\xff\xbd\x2e\xf0\x59\x62\x06\x00\x00")

func piecesBrSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesBrSvg,
		"pieces/bR.svg",
	)
}

func piecesBrSvg() (*asset, error) {
	bytes, err := piecesBrSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/bR.svg", size: 1634, mode: os.FileMode(420), modTime: time.Unix(1445797357, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesWbSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\x84\x54\xdd\x72\x9b\x3c\x10\xbd\xcf\x53\xec\x90\x5b\x47\xe8\x07\x89\x9f\xd8\x99\xf9\xe6\xbb\xb5\x1f\x82\x06\xc5\xd0\x12\xf0\x80\x6c\xd7\x7d\xfa\x6a\xa5\x85\xb8\x9d\xb4\xc5\x63\xb4\x3e\x3a\x7b\xce\x59\x0d\x78\x3b\x5f\x8e\xf0\xfd\xbd\x1f\xe6\x5d\xd2\x3a\x77\xaa\xd2\xf4\x7a\xbd\xb2\xab\x62\xe3\x74\x4c\x25\xe7\x3c\xf5\x8c\x04\x2e\x76\x9a\xbb\x71\xd8\x25\x82\x89\x04\xae\x5d\xe3\xda\x5d\x92\xe9\x04\x5a\xdb\x1d\x5b\x17\xea\x97\x07\x80\xed\x11\x66\x77\xeb\xed\x2e\x19\x4f\xf5\x6b\xe7\x6e\x95\x78\x86\xb7\xae\xef\xab\x61\x1c\x6c\x2c\x9f\xa6\x73\x6f\x2b\x7b\xb1\xc3\xd8\x34\x04\xdd\xb1\x67\x37\x8d\xdf\x6c\xf5\xc8\xc3\xb5\xfc\x7e\x0a\x9e\x95\x60\x7a\x45\xfa\x6e\xb0\xaf\xf5\xa9\x9a\xc6\xf3\xd0\xfc\x82\x7e\x1d\xbb\xe1\x37\xf8\xbd\x73\x76\xea\x3b\xbf\x54\xd9\x0a\x36\xf5\xdc\xd6\xd3\x54\xdf\x28\x1d\xc1\x1f\x61\xc2\x4c\xf7\x53\x85\x51\x1e\xdf\xc2\xf5\xc7\xa8\x4b\xb0\x2f\x67\xe7\x16\x09\x2f\x72\xaa\x5d\x4b\x35\x40\xb3\x4b\x0e\x50\x6e\x94\x81\xff\x41\x48\xa6\x7c\xa9\x19\x57\x20\x4a\x26\x84\x87\x59\xa6\x40\x4a\xa6\x37\x2a\xf3\x0c\xa9\x59\x51\x12\xaa\x24\x33\x82\xd8\xca\x44\x85\xb8\xaa\x9c\x19\x8d\x2c\x9d\x01\x0a\x16\xb8\x53\x30\x25\x7d\xc9\xca\x1c\xf7\x95\x0e\x75\x19\x3a\x0a\xa6\x91\x11\xf5\x72\xa6\xd5\xe2\xe3\x19\x86\xdc\xf3\xc0\xa1\x54\x01\xa7\xb4\x81\x5f\x2e\x22\xde\x39\x33\x24\x6d\x98\xc9\x73\xb2\x34\x31\x05\x1a\x67\x98\x8c\x9b\x38\x74\xb8\xfd\x48\x20\xfd\xcb\xe9\x08\x6f\x2f\xd1\x3c\x0f\xc7\xe0\x7d\xe4\x5a\x29\x1e\xf7\x14\x47\x84\x13\xc2\xe9\x8e\xf8\x06\xc9\xb1\x43\x9a\x75\xf5\x3b\x6a\x23\x83\x82\xf2\x88\x08\xaa\x38\xa8\xe0\x71\x50\xb1\xa0\x42\x46\x9e\x58\x3b\x97\xca\xe7\x0a\xda\x98\x0f\xbd\xe2\x8a\x4d\x31\x49\xcc\xfd\x8f\xe1\xa4\x86\x02\xfe\x03\x89\xfe\xfe\xeb\xfb\xfd\x07\x24\xdf\x7c\x86\x22\xf7\x43\x6f\x9b\x1e\xa9\xb8\x93\x8d\x27\x46\x09\xf7\xeb\xbc\x07\x4a\xb7\xa7\x93\x39\xd0\xb4\xda\xab\xef\x63\x2d\x31\xf3\x01\xad\x45\x81\x98\xdf\x2d\x12\x52\xbd\x7f\xea\xef\x5f\x91\x4f\x1f\xf9\xf0\xd6\x85\xf7\xec\x99\xb2\x86\xa4\x5b\xfc\x07\x79\x79\xf8\x19\x00\x00\xff\xff\xd8\xa0\xa7\x83\x6a\x04\x00\x00")

func piecesWbSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesWbSvg,
		"pieces/wB.svg",
	)
}

func piecesWbSvg() (*asset, error) {
	bytes, err := piecesWbSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/wB.svg", size: 1130, mode: os.FileMode(420), modTime: time.Unix(1445797361, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesWkSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xb4\x54\x4d\x73\x9b\x30\x10\xbd\xfb\x57\xec\x28\x57\x22\xf4\x01\xc6\x60\xe3\x4b\xae\xee\x8f\xa0\x41\x01\xb5\x04\x3c\x20\x9b\xba\xbf\xbe\xd2\x22\x70\x32\x6d\xea\x7a\xa6\xe1\x60\x3d\x69\x57\xbb\xef\xbd\xd5\x78\x37\x9c\x2b\xf8\xf1\xda\xb4\x43\x4e\x6a\x63\x8e\x59\x18\x8e\xe3\x48\x47\x49\xbb\xbe\x0a\x05\x63\x2c\xb4\x19\x04\xce\xaa\x1f\x74\xd7\xe6\x84\x53\x4e\x60\xd4\xa5\xa9\x73\x12\xc5\x04\x6a\xa5\xab\xda\x20\xde\xaf\x00\x76\x15\x0c\xe6\xd2\xa8\x9c\xbc\xe8\xa6\xc9\xda\xae\x55\x5b\x70\xf0\xb1\x3b\x16\xcf\xda\x5c\x32\xee\xf7\xfd\xa9\x51\x99\x3a\xab\xb6\x2b\xcb\xad\xbd\xd4\x77\xdf\x55\xf6\xc0\xf0\x9b\xf7\x8f\xd8\x28\xe3\x34\x5e\x4e\x1a\xdd\xaa\xe7\xe2\x98\xf5\xdd\xa9\x2d\xb7\x6f\x0e\xbf\x75\xba\x7d\x7f\xfa\xaa\x8d\xea\x1b\x6d\x97\x2c\x5a\xee\x97\xc5\x50\x17\x7d\x5f\x5c\x3c\x37\x7f\x7c\x65\x87\x32\xac\x90\x63\x61\x6a\x44\x00\x65\x4e\xbe\x80\x10\x34\x0e\x38\xa7\x6b\x09\x87\x69\xb3\x26\x3e\xfe\xbb\xe2\x0f\xe4\x2c\x3c\x91\xda\x96\x40\xf8\x51\x33\x16\x6c\x5c\x9b\x38\xd8\x7c\x62\x13\x27\x42\xc4\xf0\xb4\x20\x91\x04\x3c\xa1\x76\x8d\x9d\xd6\x88\x62\x6c\xc1\x22\x72\x48\x78\x27\x84\x8b\xb1\x09\xf1\x74\xce\xb9\xa2\x27\xe0\x1b\x5f\x6d\xae\x3e\xad\x7f\x12\xf4\xf0\x82\xdf\x5f\x35\xb9\xa9\x7f\x3d\x19\x73\xbf\x50\x3b\xb5\x38\x90\x89\xa3\x94\x04\x11\xa3\x28\x14\x57\x29\xa6\xc8\xc1\x23\x66\x73\x66\x14\x71\xa4\xeb\xb2\x36\x4e\x54\x8a\xa2\x24\x9a\x20\xdd\x68\xf8\xda\x4b\x92\x36\xe2\xdf\x84\x48\x16\x24\x27\x13\x52\x97\x97\x4e\x97\xd6\x6f\xea\xcc\xc5\x91\x9c\x48\xdf\xa1\xc3\x42\xf9\x27\xdc\x63\xd7\x2d\x0b\xd8\x64\x81\x25\x29\xf0\xd7\x4b\xfd\xe7\x27\x76\xab\xbe\x97\x9c\xd8\x9a\x93\xc9\xf2\x6a\xb2\x8d\xfd\xb7\x3e\x7e\x94\x32\xc2\x1e\xd1\x3c\xc6\x7b\xeb\xef\xc2\x6a\xbf\xda\xb9\x3f\xb8\xfd\xea\x57\x00\x00\x00\xff\xff\xdb\x19\xf5\xd8\x09\x05\x00\x00")

func piecesWkSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesWkSvg,
		"pieces/wK.svg",
	)
}

func piecesWkSvg() (*asset, error) {
	bytes, err := piecesWkSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/wK.svg", size: 1289, mode: os.FileMode(420), modTime: time.Unix(1445797369, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesWnSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xac\x54\x61\x6f\x9b\x4c\x0c\xfe\xde\x5f\x61\xd1\x2f\xef\x2b\x5d\xcc\xf9\x8e\x03\x8e\x86\x48\x53\xbe\x76\x3f\x02\x15\x12\xd8\x08\x44\x40\x93\x66\xbf\x7e\xbe\x0b\xa1\xeb\x96\x49\xd3\x34\xa4\xfa\xf1\xd9\x67\xfb\xf1\x73\x55\xd6\xe3\x69\x0f\x6f\x87\xb6\x1b\xf3\xa0\x9e\xa6\x63\x16\x86\xe7\xf3\x19\xcf\x1a\xfb\x61\x1f\x2a\x29\x65\xc8\x37\x02\x38\x55\xc3\xd8\xf4\x5d\x1e\x10\x52\x00\xe7\xa6\x9c\xea\x3c\x88\x4c\x00\x75\xd5\xec\xeb\xc9\xfb\x9b\x07\x80\xf5\x1e\xc6\xe9\xd2\x56\x79\xd0\x1f\x8b\x97\x66\xba\x64\xf4\x04\xbb\xa6\x6d\xb3\xae\xef\xaa\xab\xbb\xfa\x29\xb5\x1a\x5e\xdb\x2a\xab\x4e\x55\xd7\x97\xe5\x13\xd7\x0f\xfd\xd7\x2a\x7b\x94\xfe\xbb\x9d\x57\x7e\x66\x46\x68\x96\x48\xdb\x74\xd5\x4b\x71\xcc\x86\xfe\xb5\x2b\x9f\x7e\x08\x7e\xe9\x9b\xee\x63\xf4\xd0\x4c\xd5\xd0\x36\x0c\x59\xb4\xd4\x97\xc5\x58\x17\xc3\x50\x5c\x66\x6e\x73\xf8\x9d\x9d\xdf\x88\x77\x3a\x16\x53\xed\x3d\x80\x32\x0f\x3e\x83\x52\x82\x24\x6c\x41\x2b\x34\x82\x08\x74\xea\x30\x65\x14\xda\xc2\x33\x90\x71\xb8\xf5\x28\x41\xb1\xe5\x8b\xa0\x34\xdf\x09\xe6\x3e\xb3\x48\x5e\x99\xc7\x9d\xff\x7e\xd9\x3c\x80\xf0\x77\x04\x22\x37\x6e\xcb\x88\x3c\x53\x49\xb4\x04\x94\x62\x64\x84\x32\xa8\x13\xa0\x58\xa8\xc4\x11\xd0\x42\x59\xb6\x48\xcc\x8c\x50\x47\x40\xc4\x0e\x67\x2c\x5a\xc3\x31\x89\x32\x06\x52\x18\x11\x17\xa0\x8d\x5d\x5e\xb9\xce\x24\x1d\x12\xbf\xb6\xe5\x16\xa8\xb4\x8b\x68\xb7\xb4\x75\x60\xd0\xda\xc4\x75\xe2\x41\x31\x07\x19\xb8\x37\xcb\x72\xb3\xdb\xdb\x49\x63\x6a\x05\x4f\x60\x82\x4c\x5a\xb2\x0e\x8e\x16\xaa\x44\x58\x34\x6e\xb8\x66\xed\x58\xbf\xab\x93\x5c\xf3\x11\xbb\xb1\x8b\xc5\x4e\x58\xb9\xe0\xb3\xdb\xd2\x5c\xc5\xbf\x79\xc4\xec\x52\xee\x20\x65\x0a\x8a\x84\x5b\x9b\xdf\x27\x99\x1f\xc9\xdb\x7f\x23\xba\x75\x6f\x68\xd8\x7c\x02\xb7\x86\xff\x03\x5e\x0b\x1c\x91\xbb\x89\xa5\xe2\xdb\x5d\x06\x1f\xff\xc1\xff\x80\x01\xb1\x22\xef\x73\x68\x99\xe3\xa5\xbd\x9f\x98\x2b\x16\x02\xd3\x50\x74\xe3\xae\x1f\x0e\x79\x70\x28\xa6\xa1\x79\xfb\x4f\x62\x1a\xc7\x82\xeb\xc4\xca\x99\xeb\xd1\x62\x6c\xb5\x58\x19\xa4\x44\xff\xff\x17\xe4\xd7\xe1\x7e\xf3\xb0\x76\x3f\x1d\x9b\x87\xef\x01\x00\x00\xff\xff\xe4\xc9\xe6\xad\x63\x04\x00\x00")

func piecesWnSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesWnSvg,
		"pieces/wN.svg",
	)
}

func piecesWnSvg() (*asset, error) {
	bytes, err := piecesWnSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/wN.svg", size: 1123, mode: os.FileMode(420), modTime: time.Unix(1445797366, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesWpSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\x5c\x92\xcd\x72\x9b\x30\x10\xc7\xef\x7e\x8a\x1d\xe5\x8a\x05\xfa\x02\xa4\x18\x5f\x72\x6d\x1f\x82\x89\x15\xa3\x96\x20\x8f\x50\x42\x9d\xa7\xef\x4a\x60\x3a\x8d\x0e\xd6\x6f\xff\xfb\xa1\xdd\x35\xa7\xf9\xf3\x0a\x7f\xde\xc7\x69\xee\xc8\x10\xe3\xcd\x94\xe5\xb2\x2c\x74\x11\xd4\x87\x6b\xc9\xab\xaa\x2a\x31\x82\xc0\xa7\x0d\xb3\xf3\x53\x47\x18\x65\x04\x16\x77\x89\x43\x47\xa4\x22\x30\x58\x77\x1d\x62\xe6\xf3\x01\xe0\x74\xeb\xe3\x80\x37\xc0\xa5\x23\x3f\x81\xf3\x42\xc3\x0b\x30\x4d\x1b\x8d\xc4\xda\x82\x55\x88\x19\x44\x72\xa4\x9b\xb6\x49\xa0\x5c\x17\x4c\xd2\x86\x25\x6e\x50\x57\x54\xb4\x29\xa4\xa6\xad\x28\xf0\x57\x01\x4a\xaa\x40\xaf\xd2\x2b\x72\x96\xfc\x99\x04\xad\x44\x0a\x95\xb2\xe0\x92\xb6\x12\x58\x43\x35\x2b\x78\x9d\x74\x0c\x92\xd9\x6a\x68\x85\xa9\x15\x26\x08\x46\x55\xbb\xa1\xc6\xd2\x3f\x40\x88\x07\xbf\x6c\x9c\x43\xb8\xc6\x9c\x2d\x33\x55\xd3\x7b\x4d\xd4\x54\xbd\xbd\xc6\xdb\xbd\x89\x15\x53\x67\x99\xd6\x76\x31\x96\x35\xeb\x10\x5c\x51\xdc\xca\x63\x3a\xb4\x1a\xb6\xcd\xcd\xeb\x6d\x19\x19\x92\xb3\xde\xd6\x85\x8f\x70\x86\xfb\xcb\xeb\xfc\x02\x92\x17\x3c\xc7\xfb\x68\x3b\xe2\x6f\xfd\xab\x8b\x77\xc3\x9e\xe1\xcd\x8d\xa3\x79\x7a\xcb\x67\xb5\x8e\xdf\xbc\xc7\xf0\x31\x5a\x33\xf9\xe9\xcb\x06\xff\x8c\x25\x82\xff\x6d\xcd\x53\x95\xcf\xc3\x3e\xe6\xbf\xd7\xe0\xf8\xbb\x32\xba\xc9\xbe\xf6\x37\x13\xfc\xc7\x74\xf9\x4f\xfd\xe5\xdd\x64\xde\x5d\xb4\x61\x97\xb3\x35\x3a\xbc\x8c\xdc\xc5\x4b\x3f\x0f\x7d\x08\xfd\x3d\xbd\x6e\x77\xf9\x5f\x7f\x04\xca\xf3\xe1\x94\xbe\xb6\xf3\xe1\x6f\x00\x00\x00\xff\xff\x88\xb7\x8e\xde\x96\x02\x00\x00")

func piecesWpSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesWpSvg,
		"pieces/wP.svg",
	)
}

func piecesWpSvg() (*asset, error) {
	bytes, err := piecesWpSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/wP.svg", size: 662, mode: os.FileMode(420), modTime: time.Unix(1445797373, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesWqSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xbc\x54\xcd\x8e\x9b\x30\x10\xbe\xe7\x29\x46\xde\x4b\x2b\x99\x1f\xdb\x40\x80\x84\x48\x55\xae\xed\x43\xd0\xc5\x01\x5a\x02\x91\x71\x42\xb3\x4f\xdf\xb1\xf9\x49\x9a\xc3\xee\xa5\x1b\x2c\xe5\xfb\x3c\x63\xcf\x7c\x33\x8e\xbd\xed\x2f\x25\xfc\x39\x36\x6d\x9f\x91\x4a\xeb\x53\xea\x79\xc3\x30\xb8\x83\x70\x3b\x55\x7a\xdc\xf7\x7d\x0f\x57\x10\xb8\x48\xd5\xd7\x5d\x9b\x11\xe6\x32\x02\x43\x5d\xe8\x2a\x23\x41\x48\xa0\x92\x75\x59\x69\xcb\x77\x2b\x80\x6d\x09\xbd\xbe\x36\x32\x23\xdd\x29\x7f\xad\xf5\x35\x65\x1b\x38\xd4\x4d\x93\xbe\x1c\xec\x37\xce\x9c\x07\xaf\xa3\xce\x8d\x4c\xe5\x45\xb6\x5d\x51\x6c\x30\x84\xea\x7e\xcb\xf4\xc5\xb7\xdf\x3c\x77\x6c\xda\x94\xb9\xe1\x62\x69\xea\x56\xbe\xe6\xa7\x54\x75\xe7\xb6\xd8\xdc\x19\x7f\x75\x75\xfb\xaf\xf5\x58\x6b\xa9\x9a\x1a\x21\x0d\x96\xfd\x45\xde\x57\xb9\x52\xf9\x35\x6d\xbb\x56\x2e\xe6\x9b\x3a\x5b\x14\x96\x75\xca\x75\x65\x19\x40\x91\x91\x1f\x90\x00\x13\xf0\x0d\x38\x0e\x1f\x18\x0e\x08\xe9\xa3\xc5\xae\x79\x23\xd3\x36\xad\xf2\xb6\x3f\x74\xea\x98\x11\x4b\x9b\x5c\xcb\x2f\x0e\xa3\x0e\xfb\x4a\xc0\xfb\xdc\x34\x2c\x74\x43\xea\xe0\xcf\xe7\xa7\x12\xfc\x29\x15\xad\xa9\x13\x3c\xa3\x1c\x1e\x60\xa2\xf7\xd2\x50\x1e\xc1\x1e\xd8\x1a\x1b\xcc\x51\x11\x08\x7f\xc2\xc8\x78\xbe\x83\x88\x29\x0b\x0c\x32\xca\xc3\x11\x19\x43\xe4\xe1\xbc\x03\x39\x47\x9e\x58\xca\x92\x9b\x99\x05\x94\xf9\x33\xb3\x9b\xd7\x63\x2c\x9b\xf4\x0d\x66\xe1\xd3\x85\x7b\xb8\x12\x3f\xcf\x5a\x6f\x3e\x14\x8e\x10\x83\xc9\x62\x11\xaf\x16\x15\xbe\xa9\xc7\x28\x12\x38\x9d\x19\x22\x15\x02\xe7\xfb\x71\xb5\x30\x12\x47\x16\x2d\x68\xc2\x89\xb5\x71\x30\x2a\xe2\x3b\x9c\x1a\x24\x4c\x8d\x7c\x61\x22\x98\xbd\x33\x13\xa6\x29\x36\x82\xb1\x44\x93\x27\x02\x93\x6d\x4c\x29\xc4\x2c\x43\x4c\xc2\xc4\x22\xd5\x38\x46\xf9\x76\x3d\x16\x64\x0e\x21\x9e\x8e\x62\x3f\x66\xb6\xbd\xbd\x1d\xd7\xff\x68\xe5\x5d\xdb\x30\x6a\x62\xff\x02\xc9\xac\xe6\x21\xb2\x7d\x0a\xed\x5b\xf3\x4e\xbc\x5b\xab\x63\x6a\xca\x43\xe5\x23\x4e\xd5\x7f\x14\x73\xeb\x95\xbb\xd5\xd6\x3c\xdc\xbb\xd5\xdf\x00\x00\x00\xff\xff\xe0\xcf\x6d\x6c\xe1\x05\x00\x00")

func piecesWqSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesWqSvg,
		"pieces/wQ.svg",
	)
}

func piecesWqSvg() (*asset, error) {
	bytes, err := piecesWqSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/wQ.svg", size: 1505, mode: os.FileMode(420), modTime: time.Unix(1445797377, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

var _piecesWrSvg = []byte("\x1f\x8b\x08\x00\x00\x09\x6e\x88\x00\xff\xa4\x93\xdd\x72\xb2\x30\x10\x86\xcf\xbd\x8a\x9d\x78\xaa\x40\xf8\xd1\x21\x80\x57\xf0\x7d\x17\x41\x25\x42\x5a\x4c\x98\x10\xa5\xf6\xea\x9b\x84\x3f\x6b\xad\xed\x8c\x9c\x3c\x9b\xd7\xec\xee\x9b\x35\x49\xdb\x73\x09\xef\xc7\x9a\xb7\x19\xaa\x94\x6a\x88\xeb\x76\x5d\xe7\x74\x81\x23\x64\xe9\xfa\x9e\xe7\xb9\x7a\x07\x82\x33\x95\x2d\x13\x3c\x43\xd8\xc1\x08\x3a\x56\xa8\x2a\x43\x61\x84\xa0\xa2\xac\xac\x94\x8d\x77\x0b\x80\xb4\x84\x56\x5d\x6a\x9a\x21\xd1\xe4\x7b\xa6\x2e\x04\x27\x70\x60\x75\x4d\x96\x07\xfb\xf5\xab\xf5\xcd\xaf\x6b\x79\xaa\x29\xa1\x67\xca\x45\x51\x24\xba\x84\x14\x6f\x94\x2c\x3d\xfb\x8d\xeb\xb5\x6d\x4b\xb0\x13\x4d\x4a\xcd\x38\xdd\xe7\x0d\x91\xe2\xc4\x8b\xe4\x4a\x7c\x15\x8c\x7f\x55\x8f\x4c\x51\x59\x33\x0d\x12\x4e\xf9\x45\xde\x56\xb9\x94\xf9\x85\x70\xc1\xe9\x24\xcf\xee\xec\xa1\xf4\xb1\x9a\x5c\x55\x36\x02\x28\x32\xf4\x1f\xe2\x55\x10\xc3\x3f\x08\x36\x33\x37\x9a\xf1\x84\x18\x3e\x00\x0d\x19\xc3\x44\x6e\x3c\xbf\x9c\x94\x4a\x10\xb8\x3f\x74\xc0\x7e\x5f\xcb\xd0\x37\x2d\x82\x99\xa3\xbe\x79\xba\x09\x5e\xe1\xd0\x14\xc3\x2b\x73\x0c\x1c\x8d\xc0\x58\xd3\xf7\x26\x1a\xd9\x8f\x46\x58\x35\xf0\x26\xda\x11\x84\x23\x70\xf8\x94\x27\x5b\xc1\x54\xd2\xde\xb6\xc6\x4d\x38\xd0\x78\x7d\x90\x36\x6c\xd7\xf4\x63\x27\xea\x13\xe7\x08\x6f\xff\x60\x0a\x6e\x6f\x90\xbd\x34\x8f\xbc\x4e\xcd\x02\xdf\x89\xfa\x3f\x08\xcf\x51\x6f\xe0\xf7\xf1\xdf\x1b\x9a\x7d\x34\xd7\xb7\xf2\xdb\x73\xb8\xef\x32\x75\xcb\xdd\x22\x35\xaf\x76\xb7\xf8\x0c\x00\x00\xff\xff\xed\x96\xaa\xe2\xde\x03\x00\x00")

func piecesWrSvgBytes() ([]byte, error) {
	return bindataRead(
		_piecesWrSvg,
		"pieces/wR.svg",
	)
}

func piecesWrSvg() (*asset, error) {
	bytes, err := piecesWrSvgBytes()
	if err != nil {
		return nil, err
	}

	info := bindataFileInfo{name: "pieces/wR.svg", size: 990, mode: os.FileMode(420), modTime: time.Unix(1445797380, 0)}
	a := &asset{bytes: bytes, info: info}
	return a, nil
}

// Asset loads and returns the asset for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func Asset(name string) ([]byte, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("Asset %s can't read by error: %v", name, err)
		}
		return a.bytes, nil
	}
	return nil, fmt.Errorf("Asset %s not found", name)
}

// MustAsset is like Asset but panics when Asset would return an error.
// It simplifies safe initialization of global variables.
func MustAsset(name string) []byte {
	a, err := Asset(name)
	if err != nil {
		panic("asset: Asset(" + name + "): " + err.Error())
	}

	return a
}

// AssetInfo loads and returns the asset info for the given name.
// It returns an error if the asset could not be found or
// could not be loaded.
func AssetInfo(name string) (os.FileInfo, error) {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	if f, ok := _bindata[cannonicalName]; ok {
		a, err := f()
		if err != nil {
			return nil, fmt.Errorf("AssetInfo %s can't read by error: %v", name, err)
		}
		return a.info, nil
	}
	return nil, fmt.Errorf("AssetInfo %s not found", name)
}

// AssetNames returns the names of the assets.
func AssetNames() []string {
	names := make([]string, 0, len(_bindata))
	for name := range _bindata {
		names = append(names, name)
	}
	return names
}

// _bindata is a table, holding each asset generator, mapped to its name.
var _bindata = map[string]func() (*asset, error){
	"pieces/.DS_Store": piecesDs_store,
	"pieces/bB.svg":    piecesBbSvg,
	"pieces/bK.svg":    piecesBkSvg,
	"pieces/bN.svg":    piecesBnSvg,
	"pieces/bP.svg":    piecesBpSvg,
	"pieces/bQ.svg":    piecesBqSvg,
	"pieces/bR.svg":    piecesBrSvg,
	"pieces/wB.svg":    piecesWbSvg,
	"pieces/wK.svg":    piecesWkSvg,
	"pieces/wN.svg":    piecesWnSvg,
	"pieces/wP.svg":    piecesWpSvg,
	"pieces/wQ.svg":    piecesWqSvg,
	"pieces/wR.svg":    piecesWrSvg,
}

// AssetDir returns the file names below a certain
// directory embedded in the file by go-bindata.
// For example if you run go-bindata on data/... and data contains the
// following hierarchy:
//     data/
//       foo.txt
//       img/
//         a.png
//         b.png
// then AssetDir("data") would return []string{"foo.txt", "img"}
// AssetDir("data/img") would return []string{"a.png", "b.png"}
// AssetDir("foo.txt") and AssetDir("notexist") would return an error
// AssetDir("") will return []string{"data"}.
func AssetDir(name string) ([]string, error) {
	node := _bintree
	if len(name) != 0 {
		cannonicalName := strings.Replace(name, "\\", "/", -1)
		pathList := strings.Split(cannonicalName, "/")
		for _, p := range pathList {
			node = node.Children[p]
			if node == nil {
				return nil, fmt.Errorf("Asset %s not found", name)
			}
		}
	}
	if node.Func != nil {
		return nil, fmt.Errorf("Asset %s not found", name)
	}
	rv := make([]string, 0, len(node.Children))
	for childName := range node.Children {
		rv = append(rv, childName)
	}
	return rv, nil
}

type bintree struct {
	Func     func() (*asset, error)
	Children map[string]*bintree
}

var _bintree = &bintree{nil, map[string]*bintree{
	"pieces": &bintree{nil, map[string]*bintree{
		".DS_Store": &bintree{piecesDs_store, map[string]*bintree{}},
		"bB.svg":    &bintree{piecesBbSvg, map[string]*bintree{}},
		"bK.svg":    &bintree{piecesBkSvg, map[string]*bintree{}},
		"bN.svg":    &bintree{piecesBnSvg, map[string]*bintree{}},
		"bP.svg":    &bintree{piecesBpSvg, map[string]*bintree{}},
		"bQ.svg":    &bintree{piecesBqSvg, map[string]*bintree{}},
		"bR.svg":    &bintree{piecesBrSvg, map[string]*bintree{}},
		"wB.svg":    &bintree{piecesWbSvg, map[string]*bintree{}},
		"wK.svg":    &bintree{piecesWkSvg, map[string]*bintree{}},
		"wN.svg":    &bintree{piecesWnSvg, map[string]*bintree{}},
		"wP.svg":    &bintree{piecesWpSvg, map[string]*bintree{}},
		"wQ.svg":    &bintree{piecesWqSvg, map[string]*bintree{}},
		"wR.svg":    &bintree{piecesWrSvg, map[string]*bintree{}},
	}},
}}

// RestoreAsset restores an asset under the given directory
func RestoreAsset(dir, name string) error {
	data, err := Asset(name)
	if err != nil {
		return err
	}
	info, err := AssetInfo(name)
	if err != nil {
		return err
	}
	err = os.MkdirAll(_filePath(dir, filepath.Dir(name)), os.FileMode(0755))
	if err != nil {
		return err
	}
	err = ioutil.WriteFile(_filePath(dir, name), data, info.Mode())
	if err != nil {
		return err
	}
	err = os.Chtimes(_filePath(dir, name), info.ModTime(), info.ModTime())
	if err != nil {
		return err
	}
	return nil
}

// RestoreAssets restores an asset under the given directory recursively
func RestoreAssets(dir, name string) error {
	children, err := AssetDir(name)
	// File
	if err != nil {
		return RestoreAsset(dir, name)
	}
	// Dir
	for _, child := range children {
		err = RestoreAssets(dir, filepath.Join(name, child))
		if err != nil {
			return err
		}
	}
	return nil
}

func _filePath(dir, name string) string {
	cannonicalName := strings.Replace(name, "\\", "/", -1)
	return filepath.Join(append([]string{dir}, strings.Split(cannonicalName, "/")...)...)
}
