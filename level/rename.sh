for item in `ls *.js`

do
  new=`echo $item | sed 's/js/ts/'`
  mv $item $new
done
