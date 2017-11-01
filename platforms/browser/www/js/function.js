var db = openDatabase("dbPenilaian", "1.0", "Daftar Nilai", 2*1024*1024);  // Open SQLite Database 
var dataset;
var DataType;

/**
* initDatabase
*
* inisialisasi database
*
*/ 
function initDatabase(){
    try {
        if (!window.openDatabase)  // Check browser is supported SQLite or not.
        {
            alert('Databases are not supported in this browser.');
        }
        else {
            createTable();  // If supported then call Function for create table in SQLite
        }
    } catch (e) {
        if (e == 2) {
            // Version number mismatch. 
            alert("Invalid database version.");
        } else {
            alert("Unknown error " + e + ".");
        }
        return;
    }
}

/**
* createTable
* 
* buat tabel database jika tabel belum ada
*/ 
function createTable(){
	//buat tabel SQL pada run pertama (IF NOT EXISTS)
    sqlStatement = "CREATE  TABLE  IF NOT EXISTS tblSiswa (idSiswa INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idKelas INTEGER, noUrut INTEGER, txtNamaSiswa VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], console.log("SQL Success"), onError); });
    sqlStatement2 = "CREATE  TABLE  IF NOT EXISTS tblJurusan (idJurusan INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , txtJurusan VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement2, [], console.log("SQL Success"), onError); });
    sqlStatement3 = "CREATE  TABLE  IF NOT EXISTS tblKelas (idKelas INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idJurusan INTEGER, txtKelas VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement3, [], console.log("SQL Success"), onError); });
    sqlStatement4 = "CREATE  TABLE  IF NOT EXISTS tblPenilaian (idPenilaian INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, bobot INTEGER, txtPenilaian VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement4, [], addBobot, onError); });
    sqlStatement4b = "CREATE  TABLE  IF NOT EXISTS tblKompetensi (idKompetensi INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE, idMapel INTEGER, txtKompetensi VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement4b, [], console.log("SQL Success"), onError); });
    sqlStatement5 = "CREATE TABLE IF NOT EXISTS tblIndikator (idIndikator INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, idPenilaian INTEGER, idMapel INTEGER, idKompetensi INTEGER, txtIndikator VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement5, [], console.log("SQL Success"), onError); });
    sqlStatement6 = "CREATE TABLE IF NOT EXISTS tblMapel (idMapel INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , txtMapel VARCHAR)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement6, [], console.log("SQL Success"), onError); });
    sqlStatement7 = "CREATE TABLE IF NOT EXISTS tblDaftarNilai (idNilai INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE, idSiswa INTEGER, idMapel INTEGER, idPertemuan INTEGER, idIndikator INTEGER, nilai INTEGER)";
	db.transaction(function (tx) { tx.executeSql(sqlStatement7, [], console.log("SQL Success"), onError); });
}

/**
*
*/
function addBobot(){
    db.transaction(function (tx){
        tx.executeSql('SELECT * FROM tblPenilaian', [], function (tx, results) {
            var len = results.rows.length;
			if (len == 0){
				s1 = "INSERT INTO tblPenilaian VALUES(1, 20, 'Persiapan Kerja')";
				db.transaction(function (tx) { tx.executeSql(s1, [], console.log("SQL Success"), onError); });
				s2 = "INSERT INTO tblPenilaian VALUES(2, 20, 'Proses (Sitematika & Cara Kerja)')";
				db.transaction(function (tx) { tx.executeSql(s2, [], console.log("SQL Success"), onError); });
				s3 = "INSERT INTO tblPenilaian VALUES(3, 20, 'Hasil Kerja')";
				db.transaction(function (tx) { tx.executeSql(s3, [], console.log("SQL Success"), onError); });
				s4 = "INSERT INTO tblPenilaian VALUES(4, 20, 'Sikap Kerja')";
				db.transaction(function (tx) { tx.executeSql(s4, [], console.log("SQL Success"), onError); });
				s5 = "INSERT INTO tblPenilaian VALUES(5, 20, 'Waktu')";
				db.transaction(function (tx) { tx.executeSql(s5, [], console.log("SQL Success"), onError); });
			}
        });
    });
}

/**
* onError
*
* tampilkan pesan error transaksi SQL
*/
function onError(tx, error){
    alert(error.message);
}

/**
* showDropdown
*
* tampilkan daftar jurusan ke dropdown #pilihJurusan #pilihJurusan-1 #pilihJurusan-2 dan #pilihJurusan-kelas
* reset isi dropdown #pilihKelas dan #pilihKelas-1
*/
function showDropdown(){
	$("#pilihJurusan").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihJurusan-kelas").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihJurusan-1").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihJurusan-2").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihKelas").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	$("#pilihKelas-1").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	sqlStatement = "SELECT * FROM tblJurusan";
	db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var opsiJurusan = "<option value='"+item['idJurusan']+"'>"+item['txtJurusan']+"</option>";
                $("#pilihJurusan").append(opsiJurusan);
                $("#pilihJurusan-1").append(opsiJurusan);
                $("#pilihJurusan-2").append(opsiJurusan);
                $("#pilihJurusan-kelas").append(opsiJurusan);
            }
        });
    });
	$("#pilihJurusan").change();
	$("#pilihJurusan-1").change();
	$("#pilihJurusan-2").change();
	$("#pilihJurusan-kelas").change();
}
function showDropdownUpdateSiswa(id){
	$("#pilihJurusan-update-siswa").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihKelas-update-siswa").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	sqlStatement = "SELECT * FROM tblJurusan";
	db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var opsiJurusan = "<option value='"+item['idJurusan']+"'>"+item['txtJurusan']+"</option>";
                $("#pilihJurusan-update-siswa").append(opsiJurusan);
            }
			//$("#pilihJurusan-update-siswa").val(2);
			//$("#pilihJurusan-update-siswa").change();
			getJurusanFromKelas(id);
        });
    });
	$("#pilihJurusan-update-siswa").change();
}

/**
*
*/
function showDropdownPenilaian(){
	$("#pilihJurusan-000").html("<option value='0'>Pilih Jurusan</option>");
	$("#pilihKelas-000").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	$("#pilihSiswa-000").html("<option value='0'>Pilih Kelas Terlebih Dahulu</option>");
	$("#pilihMapel-000").html("<option value='0'>Pilih Mapel</option>");
	$("#pilihKompetensi-000").html("<option value='0'>Pilih Mapel Terlebih Dahulu</option>");
	sqlStatement = "SELECT * FROM tblJurusan";
	db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var opsiJurusan = "<option value='"+item['idJurusan']+"'>"+item['txtJurusan']+"</option>";
                $("#pilihJurusan-000").append(opsiJurusan);
            }
        });
    });
	s = "SELECT * FROM tblMapel";
	db.transaction(function (tx) {
        tx.executeSql(s, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var opsiJurusan = "<option value='"+item['idMapel']+"'>"+item['txtMapel']+"</option>";
                $("#pilihMapel-000").append(opsiJurusan);
            }
			$("#pilihJurusan-000").change();
        });
    });
	$("#pilihJurusan-000").change();
	$("#pilihKelas-000").change();
	$("#pilihSiswa-000").change();
	$("#pilihMapel-000").change();
	$("#pilihKompetensi-000").change();
}
function getKelasFromJurusan_000(){
	if($("#pilihJurusan-000").val()==0){
		$("#pilihKelas-000").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	}else{
		$("#pilihKelas-000").html("<option value='0'>Pilih Kelas</option>");
		sqlStatement = "SELECT * FROM tblKelas WHERE idJurusan="+$("#pilihJurusan-000").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsiJurusan = "<option value='"+item['idKelas']+"'>"+item['txtKelas']+"</option>";
					$("#pilihKelas-000").append(opsiJurusan);
				}
				$("#pilihKelas-000").change();
			});
		});
	}
}
function getSiswaFromKelas_000(){
	if($("#pilihKelas-000").val()==0){
		$("#pilihSiswa-000").html("<option value='0'>Pilih Kelas Terlebih Dahulu</option>");
	}else{
		$("#pilihSiswa-000").html("<option value='0'>Pilih Siswa</option>");
		sqlStatement = "SELECT * FROM tblSiswa WHERE idKelas="+$("#pilihKelas-000").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsiJurusan = "<option value='"+item['idSiswa']+"'>"+item['txtNamaSiswa']+"</option>";
					$("#pilihSiswa-000").append(opsiJurusan);
				}
			});
		});
	}
	$("#pilihSiswa-000").change();
}
function getKompetensiFromMapel_000(){
	if($("#pilihMapel-000").val()==0){
		$("#pilihKompetensi-000").html("<option value='0'>Pilih Mapel Terlebih Dahulu</option>");
	}else{
		$("#pilihKompetensi-000").html("<option value='0'>Pilih Kompetensi</option>");
		sqlStatement = "SELECT * FROM tblKompetensi WHERE idMapel="+$("#pilihMapel-000").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsi = "<option value='"+item['idKompetensi']+"'>"+item['txtKompetensi']+"</option>";
					$("#pilihKompetensi-000").append(opsi);
				}
			});
		});
	}
	$("#pilihKompetensi-000").change();
}

/**
* showDropdownMapel
*
* Perlihatkan mapel pada dropdown #dd-mapel-00
* dan list komponen pada dropdown #dd-komponen-00
*
*/
function showDropdownMapel(){
	$("#pilihMapel").html("<option value='0'>Pilih Mapel</option>");
	$("#pilihMapel-1").html("<option value='0'>Pilih Mapel</option>");
	sqlStatement = "SELECT * FROM tblMapel";
	db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var mapel = "<option value='"+item['idMapel']+"'>"+item['txtMapel']+"</option>";
                $("#pilihMapel").append(mapel);
                $("#pilihMapel-1").append(mapel);
            }
        });
    });
	$("#pilihMapel").change();
	$("#pilihMapel-1").change();
}

/**
* showDropdownKomponen
*
* Perlihatkan mapel pada dropdown #dd-mapel-00
* dan list komponen pada dropdown #dd-komponen-00
*
*/
function showDropdownKomponen(){
	$("#dd-mapel-00").html("<option value='0'>Pilih Mapel</option>");
	$("#dd-kompetensi-00").html("<option value='0'>Pilih Mapel Terlebih Dahulu</option>");
	$("#dd-mapel-01").html("<option value='0'>Pilih Mapel</option>");
	$("#dd-kompetensi-01").html("<option value='0'>Pilih Mapel Terlebih Dahulu</option>");
	sqlStatement = "SELECT * FROM tblMapel";
	db.transaction(function (tx) {
        tx.executeSql(sqlStatement, [], function (tx, result) {
            dataset = result.rows;
            for (var i = 0, item = null; i < dataset.length; i++) {
                item = dataset.item(i);
                var mapel = "<option value='"+item['idMapel']+"'>"+item['txtMapel']+"</option>";
                $("#dd-mapel-00").append(mapel);
                $("#dd-mapel-01").append(mapel);
            }
        });
    });
	$("#dd-mapel-00").change();
	$("#dd-kompetensi-00").change();
	$("#dd-komponen-00").val('0');
	$("#dd-komponen-00").change();
	$("#dd-mapel-01").change();
	$("#dd-kompetensi-01").change();
	$("#dd-komponen-01").val('0');
	$("#dd-komponen-01").change();
}
function get_kompetensi_from_mapel(){
	if($("#dd-mapel-00").val()==0){
		$("#dd-kompetensi-00").html("<option value='0'>Pilih Mapel Terlebih Dahulu</option>");
	}else{
		$("#dd-kompetensi-00").html("<option value='0'>Pilih Kompetensi</option>");
		sqlStatement = "SELECT * FROM tblKompetensi WHERE idMapel="+$("#dd-mapel-00").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsi = "<option value='"+item['idKompetensi']+"'>"+item['txtKompetensi']+"</option>";
					$("#dd-kompetensi-00").append(opsi);
				}
			});
		});
	}
	$("#dd-kompetensi-00").change();
}
function get_kompetensi_from_mapel01(){
	if($("#dd-mapel-01").val()==0){
		$("#dd-kompetensi-01").html("<option value='0'>Pilih Mapel Terlebih Dahulu</option>");
	}else{
		$("#dd-kompetensi-01").html("<option value='0'>Pilih Kompetensi</option>");
		sqlStatement = "SELECT * FROM tblKompetensi WHERE idMapel="+$("#dd-mapel-01").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsi = "<option value='"+item['idKompetensi']+"'>"+item['txtKompetensi']+"</option>";
					$("#dd-kompetensi-01").append(opsi);
				}
			});
		});
	}
	$("#dd-kompetensi-01").change();
}


/**
* getKelasFromJurusan
*
* tampilkan daftar kelas pada jurusan #pilihJurusan ke dropdown #pilihKelas
*/
function getKelasFromJurusan(){
	if($("#pilihJurusan").val()==0){
		$("#pilihKelas").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	}else{
		$("#pilihKelas").html("<option value='0'>Pilih Kelas</option>");
		sqlStatement = "SELECT * FROM tblKelas WHERE idJurusan="+$("#pilihJurusan").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsiJurusan = "<option value='"+item['idKelas']+"'>"+item['txtKelas']+"</option>";
					$("#pilihKelas").append(opsiJurusan);
				}
			});
		});
	}
	$("#pilihKelas").change();
}

/**
* getKelasFromJurusan1
* 
* tampilkan daftar kelas pada jurusan #pilihJurusan-1 ke dropdown #pilihKelas-1
*/
function getKelasFromJurusan1(){
	if($("#pilihJurusan-1").val()==0){
		$("#pilihKelas-1").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	}else{
		$("#pilihKelas-1").html("<option value='0'>Pilih Kelas</option>");
		sqlStatement = "SELECT * FROM tblKelas WHERE idJurusan="+$("#pilihJurusan-1").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsiJurusan = "<option value='"+item['idKelas']+"'>"+item['txtKelas']+"</option>";
					$("#pilihKelas-1").append(opsiJurusan);
				}
			});
		});
	}
	$("#pilihKelas-1").change();
}
function getKelasFromJurusan2(id){
	if($("#pilihJurusan-update-siswa").val()==0){
		$("#pilihKelas-update-siswa").html("<option value='0'>Pilih Jurusan Terlebih Dahulu</option>");
	}else{
		$("#pilihKelas-update-siswa").html("<option value='0'>Pilih Kelas</option>");
		sqlStatement = "SELECT * FROM tblKelas WHERE idJurusan="+$("#pilihJurusan-update-siswa").val();
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var opsiJurusan = "<option value='"+item['idKelas']+"'>"+item['txtKelas']+"</option>";
					$("#pilihKelas-update-siswa").append(opsiJurusan);
				}
				$("#pilihKelas-update-siswa").val(id);
				$("#pilihKelas-update-siswa").change();
			});
		});
	}
}

/**
* searchDaftarKelas
*
* tampilkan daftar kelas ke dalam tabel #tabel-daftar-kelas
*/
function searchDaftarKelas(){
	jurusan = $("#pilihJurusan-kelas").val();
	if(jurusan==0){
		alert("Pilih Jurusan terlebih dahulu untuk melihat daftar kelas.");
	}else{
		$("#tabel-daftar-kelas").html('');
		sqlStatement = "SELECT * FROM tblKelas WHERE idJurusan="+jurusan;
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				if(dataset.length == 0){
					$("#tabel-daftar-kelas").html('Data Kelas tidak dapat ditemukan. Klik tombol \"Tambah Kelas\" untuk menambahkan daftar kelas baru.');
				}
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var dataKelas = "<tr><td>"+item['txtKelas']+"</td><td style='text-align:right'><a href='#frm-update-kelas' data-rel='popup' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b' onmousedown='$(\"#idKelas-update\").val(\""+item['idKelas']+"\");$(\"#update-nama-kelas\").val(\""+item['txtKelas']+"\")'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>"
					$("#tabel-daftar-kelas").append(dataKelas);
				}
			});
		});
	}
}

/**
* searchDaftarSiswa
*
* tampilkan daftar siswa ke dalam tabel #tabel-daftar-siswa
*/
function searchDaftarSiswa(){
	jurusan = $("#pilihJurusan").val();
	kelas = $("#pilihKelas").val();
	if((kelas == 0)||(jurusan==0)){
		alert("Pilih Jurusan dan Kelas terlebih dahulu untuk melihat daftar siswa.");
	}else{
		$("#tabel-daftar-siswa").html('');
		sqlStatement = "SELECT * FROM tblSiswa WHERE idKelas="+kelas;
		db.transaction(function (tx) {
			tx.executeSql(sqlStatement, [], function (tx, result) {
				dataset = result.rows;
				if(dataset.length == 0){
					$("#tabel-daftar-siswa").html('Data Siswa tidak dapat ditemukan. Klik tombol \"Tambah Siswa\" untuk menambahkan daftar siswa baru.');
				}
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					var dataSiswa = "<tr><td>"+item['noUrut']+"</td><td>"+item['txtNamaSiswa']+"</td><td><a href='#frm-update-siswa' data-rel='popup' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b' onmousedown='$(\"#idSiswa-update\").val(\""+item['idSiswa']+"\");$(\"#update-nama-siswa\").val(\""+item['txtNamaSiswa']+"\");$(\"#update-no-urut\").val(\""+item['noUrut']+"\");$(\"#pilihKelas-update-siswa\").val(\""+item['idKelas']+"\");$(\"#pilihKelas-update-siswa\").change();showDropdownUpdateSiswa("+item['idKelas']+");'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>"
					$("#tabel-daftar-siswa").append(dataSiswa);
				}
			});
		});
	}
}
function getJurusanFromKelas(id){
	sqlStatement = "SELECT * FROM tblKelas WHERE idKelas="+id;
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				//console.log(item['idJurusan']);
				$("#pilihJurusan-update-siswa").val(item['idJurusan']);
				$("#pilihJurusan-update-siswa").change();
				getKelasFromJurusan2(id);
			}
		});
	});
}

/**
* showDaftarJurusan
* 
* tampilkan daftar jurusan ke dalam tabel #tabel-daftar-jurusan
*/
function showDaftarJurusan(){
	console.log("ShowDaftarJurusan");
	var tabel = $("#tabel-daftar-jurusan");
	tabel.html('');
	sqlStatement = "SELECT * FROM tblJurusan";
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			if(dataset.length == 0){
				tabel.html('Data Mapel tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				var dataSiswa = "<tr><td>"+item['txtJurusan']+"</td><td><a href='#frm-edit-jurusan' data-rel='popup' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b' onmousedown='$(\"#idJurusan-update\").val(\""+item['idJurusan']+"\");$(\"#un-update\").val(\""+item['txtJurusan']+"\")'></a>"+
				"<a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b' style='background: red' onclick='exeSQL(\"DELETE FROM tblJurusan WHERE idJurusan="+item['idJurusan']+"\");showDaftarJurusan()'></a></td></tr>"
				tabel.append(dataSiswa);
			}
		});
	});
}

/**
* showDaftarMapel
* 
* tampilkan daftar mapel ke dalam tabel #tabel-daftar-mapel
*/
function showDaftarMapel(){
	console.log("ShowDaftarMapel");
	$("#tabel-daftar-mapel").html('');
	sqlStatement = "SELECT * FROM tblMapel";
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			if(dataset.length == 0){
				$("#tabel-daftar-mapel").html('Data Mapel tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				var baris = "<tr><td>"+item['txtMapel']+"</td><td><a href='#frm-update-mapel' data-rel='popup' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b' onmousedown='$(\"#idMapel-update\").val(\""+item['idMapel']+"\");$(\"#update-mapel\").val(\""+item['txtMapel']+"\")'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>"
				$("#tabel-daftar-mapel").append(baris);
			}
		});
	});
}

/**
* showDaftarKD
*
* @param id_mapel
*/
function showDaftarKD(){
	var tabel = $("#tabel-daftar-kompetensi");
	tabel.html('');
	sqlStatement = "SELECT * FROM tblKompetensi WHERE idMapel = "+$("#pilihMapel").val();
	console.log(sqlStatement);
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			if(dataset.length == 0){
				tabel.html('Data Kompetensi tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				var baris = "<tr><td>"+item['txtKompetensi']+"</td><td><a href='#frm-update-kompetensi' data-rel='popup' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b' onmousedown='$(\"#idKompetensi-update\").val(\""+item['idKompetensi']+"\");$(\"#txt-mapel-update-kompetensi\").val(\""+item['txtKompetensi']+"\")'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>"
				tabel.append(baris);
			}
		});
	});
}

/**
* showDaftarIndikator
* 
* tampilkan daftar subkomponen penilaian ke dalam tabel #daftar-subkomponen
*/
function showDaftarIndikator(){
	$("#tabel-daftar-subkomponen").html('');
	sqlStatement = "SELECT * FROM tblIndikator WHERE idMapel = "+$("#dd-mapel-00").val()+" AND idKompetensi = "+$("#dd-kompetensi-00").val()+" AND idPenilaian = "+$("#dd-komponen-00").val();
	console.log(sqlStatement);
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result){
			dataset = result.rows;
			if(dataset.length == 0){
				$("#tabel-daftar-subkomponen").html('Daftar subkomponen tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++){
				item = dataset.item(i);
				var dataSub = "<tr><td>"+item['txtIndikator']+"</td><td><a href='#' data-theme='b' class='ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a><a href='#' data-theme='b' class='ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-btn-hover-b ui-btn-up-b'></a></td></tr>";
				$("#tabel-daftar-subkomponen").append(dataSub);
			}
		});
	});
}

function showDaftarPenilaian(){
	$("#tabel-penilaian").html('');
	sqlStatement = "SELECT * FROM tblIndikator WHERE idMapel = "+$("#pilihMapel-000").val()+" AND idKompetensi = "+$("#pilihKompetensi-000").val();
	idSiswa = $("#pilihSiswa-000").val();
	idMapel = $("#pilihMapel-000").val();
	idKompetensi = $("#pilihKompetensi-000").val();
	$("#id-siswa-000").val(idSiswa);
	$("#id-kompetensi-000").val(idKompetensi);
	$("#id-mapel-000").val(idMapel);
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result){
			dataset = result.rows;
			if(dataset.length == 0){
				$("#tabel-penilaian").html('Daftar subkomponen tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++){
				item = dataset.item(i);
				var dataSub = "<tr><td>"+item['txtIndikator']+"</td>"
							  + "<td><div class='ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c'><input type='number' style='text-align: right' maxlength='3' max='100' id='n"+i+"' data-val='"+item['idIndikator']+"' data-id='0' class='ui-input-text ui-body-c' oninput='javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);' value='0'/></div></td></tr>";
				$("#tabel-penilaian").append(dataSub);
			}
			$("#jumlah-baris").val(dataset.length);
			setId();
		});
	});
}
function setId(){
	var j = $("#jumlah-baris").val();
	var idSiswa = $("#id-siswa-000").val();
	var idMapel = $("#id-mapel-000").val();
	var idKompetensi = $("#id-kompetensi-000").val();
		db.transaction(function (t){
			for(i=0; i<j; i++){
				var idIndikator = $("#n"+i).data("val");
				s = "SELECT * FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idIndikator="+idIndikator+"";
				console.log(s);
				t.executeSql(s, [], function (t, r){
					ds = r.rows;
					l = ds.length;
					console.log(l);
					if(l>0){
						it = ds.item(0);
						var id = it['idIndikator']-1;
						console.log(id);
						$("#n"+id).data("id",it['idNilai']);
						$("#n"+id).val(it['nilai']);
						console.log(id+"="+$("#n"+id).data("id"));
					}
				});
			}
		});
}
function simpanNilai(){
	var j = $("#jumlah-baris").val();
	var idSiswa = $("#id-siswa-000").val();
	var idMapel = $("#id-mapel-000").val();
	var idKompetensi = $("#id-kompetensi-000").val();
	db.transaction(function (t){
		for(i=0; i<j; i++){
			var idIndikator = $("#n"+i).data("val");
			var idNilai = $("#n"+i).data("id");
			var v = $("#n"+i).val();
			var s = '';
			if(idNilai == 0){
				s = "INSERT INTO tblDaftarNilai VALUES(null, "+idSiswa+", "+idMapel+", "+idKompetensi+", "+idIndikator+", "+v+")"
			}else{
				s = "UPDATE tblDaftarNilai SET nilai="+v+" WHERE idNilai="+idNilai;
			}
			console.log(s);
			t.executeSql(s, [], function (t, r){
				console.log("update sukses");
			});
		}
	});
}

/**
*
*/
function setSiswaToLaporan(){
	sqlStatement = "SELECT * FROM tblSiswa WHERE idSiswa="+$("#pilihSiswa-000").val();
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				$("#li-nama").html(item['txtNamaSiswa']);
				$("#li-nomor").html(item['noUrut']);
			}
		});
	});
}
function showLaporanRekap(){
	var div = $("#hidden");
	var tabel = $("#konten-laporan-rekap");
	var idMapel = $("#pilihMapel-000").val();
	var idKompetensi = $("#pilihKompetensi-000").val();
	var idKelas = $("#pilihKelas-000").val();
	div.html('');
	tabel.html('');
	s = "SELECT * FROM tblSiswa WHERE idKelas="+idKelas;
	db.transaction(function (tx) {
		tx.executeSql(s, [], function (tx, result) {
			dataset = result.rows;
			var d = "<input type='hidden' id='jml-siswa' value='"+dataset.length+"'/>";
			div.html(d);
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				d = "<input type='hidden' id='h"+i+"' value='"+item['idSiswa']+"'/>";
				div.append(d);
				var baris = "<tr>"
							+	"<td style=\"border: 1px solid; text-align: center\">"+(i+1)+"</td>"
							+	"<td style=\"border: 1px solid\">"+item['noUrut']+"</td>"
							+	"<td style=\"border: 1px solid\">"+item['txtNamaSiswa']+"</td>"
							+	"<td style=\"border: 1px solid\" id=\"nr-"+item['idSiswa']+"\">0</td>"
							+	"<td style=\"border: 1px solid\" id=\"na-"+item['idSiswa']+"\">nol</td>"
							+"</tr>";
				tabel.append(baris);
			}
			showLaporanRekap2();
		});
	});
	/*db.transaction(function (tx) {
		console.log("jml-siswa="+$("#jml-siswa").val());
		jmlSiswa = parseInt($("#jml-siswa").val());
		for(var j =0; j<jmlSiswa; j++){
			idSiswa = parseInt($("#h"+j).val());
			console.log("idSiswa="+idSiswa);
			$("#nilai-j").val(j);
			s1 = "SELECT *, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=1";
			tx.executeSql(s1, [], function (tx, result) {
				dataset = result.rows
				console.log(s1);
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					console.log("idSiswa="+item['idSiswa']);
					$("#nr-"+j).html(parseFloat($("#nr-"+j).html())+item['nilai']*item['bobot']/100);
				}
			});
		}
	});*/
	window.location.href = "#laporan-rekap";
}
function showLaporanRekap2(){
	var div = $("#hidden");
	var tabel = $("#konten-laporan-rekap");
	var idMapel = $("#pilihMapel-000").val();
	var idKompetensi = $("#pilihKompetensi-000").val();
	var idKelas = $("#pilihKelas-000").val();
	console.log("jml-siswa="+$("#jml-siswa").val());
	jmlSiswa = parseInt($("#jml-siswa").val());
	for (var j=0; j<=jmlSiswa-1; j++){  
      (function(j) {
        db.transaction(function (tx) {  
			idSiswa = parseInt($("#h"+j).val());
			console.log("idSiswa="+idSiswa);
			//$("#nilai-j").val(j);
			s1 = "SELECT *, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=1";
			s2 = "SELECT *, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=2";
			s3 = "SELECT *, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=3";
			s4 = "SELECT *, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=4";
			s5 = "SELECT *, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=5";
			tx.executeSql(s1, [], function (tx, result) {
				dataset = result.rows
				console.log(idSiswa);
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					console.log("idSiswa="+idSiswa);
					$("#nr-"+item['idSiswa']).html(parseFloat($("#nr-"+item['idSiswa']).html())+item['nilai']*item['bobot']/100);
				}
			});
			tx.executeSql(s2, [], function (tx, result) {
				dataset = result.rows
				console.log(idSiswa);
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					console.log("idSiswa="+idSiswa);
					$("#nr-"+item['idSiswa']).html(parseFloat($("#nr-"+item['idSiswa']).html())+item['nilai']*item['bobot']/100);
				}
			});
			tx.executeSql(s3, [], function (tx, result) {
				dataset = result.rows
				console.log(idSiswa);
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					console.log("idSiswa="+idSiswa);
					$("#nr-"+item['idSiswa']).html(parseFloat($("#nr-"+item['idSiswa']).html())+item['nilai']*item['bobot']/100);
				}
			});
			tx.executeSql(s4, [], function (tx, result) {
				dataset = result.rows
				console.log(idSiswa);
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					console.log("idSiswa="+idSiswa);
					$("#nr-"+item['idSiswa']).html(parseFloat($("#nr-"+item['idSiswa']).html())+item['nilai']*item['bobot']/100);
				}
			});
			tx.executeSql(s5, [], function (tx, result) {
				dataset = result.rows
				console.log(idSiswa);
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					console.log("idSiswa="+idSiswa);
					$("#nr-"+item['idSiswa']).html(parseFloat($("#nr-"+item['idSiswa']).html())+item['nilai']*item['bobot']/100);
				}
				$("#nr-"+idSiswa).html(parseFloat($("#nr-"+idSiswa).html()).toFixed(2));
				$("#na-"+idSiswa).html(terbilang($("#nr-"+idSiswa).html()));
			});
        });
      })(j);
    };
	/*db.transaction(function (tx) {
		console.log("jml-siswa="+$("#jml-siswa").val());
		jmlSiswa = parseInt($("#jml-siswa").val());
		for(var j =0; j<jmlSiswa; j++){
			idSiswa = parseInt($("#h"+j).val());
			console.log("idSiswa="+idSiswa);
			$("#nilai-j").val(j);
			s1 = "SELECT *, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=1";
			tx.executeSql(s1, [], function (tx, result) {
				dataset = result.rows
				console.log(s1);
				for (var i = 0, item = null; i < dataset.length; i++) {
					item = dataset.item(i);
					console.log("idSiswa="+item['idSiswa']);
					$("#nr-"+j).html(parseFloat($("#nr-"+j).html())+item['nilai']*item['bobot']/100);
				}
			});
		}
	});*/
}
function showLaporanIndividu(){
	setSiswaToLaporan();
	var tabel = $("#konten-laporan-individu"); 
	var idSiswa = $("#pilihSiswa-000").val();
	var idMapel = $("#pilihMapel-000").val();
	var idKompetensi = $("#pilihKompetensi-000").val();
	s = "SELECT nilai, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=1";
	s2 = "SELECT nilai, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=2";
	s3 = "SELECT nilai, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=3";
	s4 = "SELECT nilai, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=4";
	s5 = "SELECT nilai, (SELECT txtIndikator FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS indikator, (SELECT idPenilaian FROM tblIndikator WHERE idIndikator=tblDaftarNilai.idIndikator) AS idPenilaian, (SELECT bobot FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS bobot, (SELECT txtPenilaian FROM tblPenilaian WHERE idPenilaian=idPenilaian) AS komponen FROM tblDaftarNilai WHERE idSiswa="+idSiswa+" AND idMapel="+idMapel+" AND idPertemuan="+idKompetensi+" AND idPenilaian=5";
	tabel.html('');
	db.transaction(function (tx) {
		tx.executeSql(s, [], function (tx, result) {
			dataset = result.rows;
			console.log(s);
			var baris = "<tr>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\">I</td>"
						+	"<td colspan=\"2\" style=\"border: 1px solid\"><b>Persiapan Kerja</b></td>"
						+	"<td style=\"border: 1px solid\"></td>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\" id=\"nilai1\">0</td>"
						+"</tr>";
			tabel.append(baris);
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				baris = "<tr>"
						+"	<td colspan=\"2\" style=\"border: 1px solid\">"+item['indikator']+"</td>"
						+"	<td style=\"border: 1px solid; text-align: center\">"+item['nilai']+"</td>"
						+"</tr>";
				$("#nilai1").html(parseFloat($("#nilai1").html())+item['nilai']*item['bobot']/100);
				tabel.append(baris);
			}
			baris = "<tr>"
					+"	<td colspan=\"2\" style=\"border: 1px solid; text-align: center\"><b>Jumlah Skor Komponen</b></td>"
					+"	<td style=\"border: 1px solid; text-align: center\">";
			if(dataset.length == 0){baris+="0"}else{baris+=item['nilai']};
			baris += "</td>";
			baris += "</tr>";
			tabel.append(baris);
		},onError);
		tx.executeSql(s2, [], function (tx, result) {
			dataset = result.rows;
			console.log(s);
			var baris = "<tr>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\">II</td>"
						+	"<td colspan=\"2\" style=\"border: 1px solid\"><b>Proses (Sistematika dan Cara Kerja)</b></td>"
						+	"<td style=\"border: 1px solid\"></td>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\" id=\"nilai2\">0</td>"
						+"</tr>";
			tabel.append(baris);
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				baris = "<tr>"
						+"	<td colspan=\"2\" style=\"border: 1px solid\">"+item['indikator']+"</td>"
						+"	<td style=\"border: 1px solid; text-align: center\">"+item['nilai']+"</td>"
						+"</tr>";
				$("#nilai2").html(parseFloat($("#nilai2").html())+item['nilai']*item['bobot']/100);
				tabel.append(baris);
			}
			baris = "<tr>"
					+"	<td colspan=\"2\" style=\"border: 1px solid; text-align: center\"><b>Jumlah Skor Komponen</b></td>"
					+"	<td style=\"border: 1px solid; text-align: center\">";
			if(dataset.length == 0){baris+="0"}else{baris+=item['nilai']};
			baris += "</td>";
			baris += "</tr>";
			tabel.append(baris);
		},onError);
		tx.executeSql(s3, [], function (tx, result) {
			dataset = result.rows;
			console.log(s);
			var baris = "<tr>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\">III</td>"
						+	"<td colspan=\"2\" style=\"border: 1px solid\"><b>Hasil Kerja</b></td>"
						+	"<td style=\"border: 1px solid\"></td>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\" id=\"nilai3\">0</td>"
						+"</tr>";
			tabel.append(baris);
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				baris = "<tr>"
						+"	<td colspan=\"2\" style=\"border: 1px solid\">"+item['indikator']+"</td>"
						+"	<td style=\"border: 1px solid; text-align: center\">"+item['nilai']+"</td>"
						+"</tr>";
				$("#nilai3").html(parseFloat($("#nilai3").html())+item['nilai']*item['bobot']/100);
				tabel.append(baris);
			}
			baris = "<tr>"
					+"	<td colspan=\"2\" style=\"border: 1px solid; text-align: center\"><b>Jumlah Skor Komponen</b></td>"
					+"	<td style=\"border: 1px solid; text-align: center\">";
			if(dataset.length == 0){baris+="0"}else{baris+=item['nilai']};
			baris += "</td>";
			baris += "</tr>";
			tabel.append(baris);
		},onError);
		tx.executeSql(s4, [], function (tx, result) {
			dataset = result.rows;
			console.log(s);
			var baris = "<tr>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\">IV</td>"
						+	"<td colspan=\"2\" style=\"border: 1px solid\"><b>Sikap Kerja</b></td>"
						+	"<td style=\"border: 1px solid\"></td>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\" id=\"nilai4\">0</td>"
						+"</tr>";
			tabel.append(baris);
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				baris = "<tr>"
						+"	<td colspan=\"2\" style=\"border: 1px solid\">"+item['indikator']+"</td>"
						+"	<td style=\"border: 1px solid; text-align: center\">"+item['nilai']+"</td>"
						+"</tr>";
				$("#nilai4").html(parseFloat($("#nilai4").html())+item['nilai']*item['bobot']/100);
				tabel.append(baris);
			}
			baris = "<tr>"
					+"	<td colspan=\"2\" style=\"border: 1px solid; text-align: center\"><b>Jumlah Skor Komponen</b></td>"
					+"	<td style=\"border: 1px solid; text-align: center\">";
			if(dataset.length == 0){baris+="0"}else{baris+=item['nilai']};
			baris += "</td>";
			baris += "</tr>";
			tabel.append(baris);
		},onError);
		tx.executeSql(s5, [], function (tx, result) {
			dataset = result.rows;
			console.log(s);
			var baris = "<tr>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\">V</td>"
						+	"<td colspan=\"2\" style=\"border: 1px solid\"><b>Waktu</b></td>"
						+	"<td style=\"border: 1px solid\"></td>"
						+	"<td rowspan=\""+(dataset.length+2)+"\" style=\"border: 1px solid; text-align: center\" id=\"nilai5\">0</td>"
						+"</tr>";
			tabel.append(baris);
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				baris = "<tr>"
						+"	<td colspan=\"2\" style=\"border: 1px solid\">"+item['indikator']+"</td>"
						+"	<td style=\"border: 1px solid; text-align: center\">"+item['nilai']+"</td>"
						+"</tr>";
				$("#nilai5").html(parseFloat($("#nilai5").html())+item['nilai']*item['bobot']/100);
				tabel.append(baris);
			}
			baris = "<tr>"
					+"	<td colspan=\"2\" style=\"border: 1px solid; text-align: center\"><b>Jumlah Skor Komponen</b></td>"
					+"	<td style=\"border: 1px solid; text-align: center\">";
			if(dataset.length == 0){baris+="0"}else{baris+=item['nilai']};
			baris += "</td>";
			baris += "</tr>";
			tabel.append(baris);
			var n = parseFloat($("#nilai1").html())+parseFloat($("#nilai2").html())+parseFloat($("#nilai3").html())+parseFloat($("#nilai4").html())+parseFloat($("#nilai5").html());
			baris = "<tr>"
					+"	<td colspan=\"3\" style=\"border: 1px solid; text-align: center\"><b>NILAI AKHIR = ( Jumlah Skor Perolehan / Jumlah Skor maks ) x Bobot</b></td>"
					+"	<td colspan=\"2\" style=\"border: 1px solid; text-align: center\">"+n+"</td>"
					+"</tr>";
			tabel.append(baris);
		},onError);
	});
	window.location.href = "#laporan-siswa";
}

/**
*
*/
function showBobot(){
	var tabel = $("#tabel-bobot");
	tabel.html('');
	sqlStatement = "SELECT * FROM tblPenilaian";
	db.transaction(function (tx) {
		tx.executeSql(sqlStatement, [], function (tx, result) {
			dataset = result.rows;
			if(dataset.length == 0){
				tabel.html('Data Komponen Penilaian tidak dapat ditemukan.');
			}
			for (var i = 0, item = null; i < dataset.length; i++) {
				item = dataset.item(i);
				var baris = "<tr><td>"+item['txtPenilaian']+"</td><td><div class='ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c'><input type='number' style='text-align: right' maxlength='3' id='k"+item['idPenilaian']+"' class='ui-input-text ui-body-c'value='"+item['bobot']+"' /></div></td></tr>"
				tabel.append(baris);
			}
		});
	});
}

/**
*
*/
function simpanBobot(){
	var bobot1 = $("#k1").val();
	var bobot2 = $("#k2").val();
	var bobot3 = $("#k3").val();
	var bobot4 = $("#k4").val();
	var bobot5 = $("#k5").val();
	exeSQL("UPDATE tblPenilaian SET bobot="+bobot1+" WHERE idPenilaian=1");
	exeSQL("UPDATE tblPenilaian SET bobot="+bobot2+" WHERE idPenilaian=2");
	exeSQL("UPDATE tblPenilaian SET bobot="+bobot3+" WHERE idPenilaian=3");
	exeSQL("UPDATE tblPenilaian SET bobot="+bobot4+" WHERE idPenilaian=4");
	exeSQL("UPDATE tblPenilaian SET bobot="+bobot5+" WHERE idPenilaian=5");
	alert("bobot baru berhasil disimpan");
}

function eksekusiSQL(){
	sqlStatement = $("#txtSQL").val();
	console.log(sqlStatement);
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], alert("SQL Success"), onError); });
}

/**
* exeSQL
*
* eksekusi sqlStatement
*
* @param sqlStatement
*/
function exeSQL(sqlStatement){
	db.transaction(function (tx) { tx.executeSql(sqlStatement, [], console.log("SQL Success"), onError); });
}

/**
*
*/
function clearText(){
	$("input[type=text]").val('');
}

function terbilang(a){
	var str = a;
	var angka = str.split(".");
	var digit = ['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan'];
	var a = digit[angka[0][0]]+' ';
	var b = digit[angka[0][1]]+' ';
	var c = digit[angka[0][2]];
	(c==undefined) ? c='' : c += ' ';
	var d = digit[angka[1][0]]+' ';
	var e = digit[angka[1][1]];
	var res = a+b+c+'koma '+d+e;
	return res;
}

/**
* 
*/
$(document).ready(function (){
    initDatabase();
	$("#searchDaftarSiswa").click(searchDaftarSiswa);
	$("#searchDaftarKelas").click(searchDaftarKelas);
	$("#pilihJurusan").change(getKelasFromJurusan);
	$("#pilihJurusan-1").change(getKelasFromJurusan1);
	$("#pilihJurusan-000").change(getKelasFromJurusan_000);
	$("#pilihKelas-000").change(getSiswaFromKelas_000);
	$("#pilihMapel-000").change(getKompetensiFromMapel_000);
	$("#eksekusiSQL").click(eksekusiSQL);
	$("#searchKompetensi").click(showDaftarKD);
	$("#searchDaftarSubkomponen").click(showDaftarIndikator);
	$("#simpan-bobot").click(simpanBobot);
	$("#btn-search-penilaian").click(showDaftarPenilaian);
	$("#btn-simpan-nilai").click(simpanNilai);
});